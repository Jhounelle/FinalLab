<template>
  <div class="container mt-4">
    <h2 class="mb-4">Admin Panel</h2>

    <button class="btn btn-primary mb-3" @click="showAddModal = true">Add Product</button>

    <!-- Error Alert -->
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show" role="alert">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
    </div>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th class="description-column">Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th style="width: 120px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>
              <img v-if="product.image" :src="getImageUrl(product.image)" class="img-thumbnail" style="max-height: 50px;" alt="Product image" />
            </td>
            <td>{{ product.name }}</td>
            <td class="description-column">{{ product.description }}</td>
            <td>₱{{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <span v-if="product.inOrders" class="badge bg-info">In Orders</span>
              <span v-else class="badge bg-success">Available</span>
            </td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editProduct(product)">Edit</button>
              <button 
                class="btn btn-sm btn-danger" 
                @click="removeProduct(product.id)"
                :disabled="product.inOrders"
                :title="product.inOrders ? 'Cannot delete products in orders' : 'Delete product'"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AddProductModal v-if="showAddModal" @close="showAddModal = false" @add-product="addProduct" />
    <EditProductModal
      v-if="showEditModal"
      :existingProduct="selectedProduct"
      @close="showEditModal = false"
      @update-product="updateProduct"
    />
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';
import AddProductModal from '@/components/AddProductModal.vue';
import EditProductModal from '@/components/EditProductModal.vue';
import axios from '../axios';
import { getImageUrl } from '../utils/imageHelper';

export default {
  components: {
    AddProductModal,
    EditProductModal
  },
  data() {
    return {
      showAddModal: false,
      showEditModal: false,
      selectedProduct: null,
      errorMessage: ''
    };
  },
  computed: {
    ...mapState(['products'])
  },
  methods: {
    ...mapMutations(['SET_PRODUCTS']),
    ...mapActions(['fetchProducts']),
    
    getImageUrl,
    
    loadProducts() {
      this.fetchProducts().then(() => {
        // After fetching products, check which ones are in orders
        this.checkProductsInOrders();
      });
    },
    
    checkProductsInOrders() {
      // Create enhanced products with inOrders property
      const productsWithOrderStatus = [...this.products];
      
      // Check each product
      const checkPromises = productsWithOrderStatus.map(product => {
        return axios.get(`/api/employee/products/${product.id}/check_ordered/`)
          .then(response => {
            product.inOrders = response.data.in_orders;
            return product;
          })
          .catch(error => {
            console.error(`Error checking if product ${product.id} is in orders:`, error);
            product.inOrders = false; // Default to false if check fails
            return product;
          });
      });
      
      // Wait for all checks to complete
      Promise.all(checkPromises).then(updatedProducts => {
        this.SET_PRODUCTS(updatedProducts);
      });
    },
    
    addProduct(newProduct, imageFile) {
      // Clear any previous error
      this.errorMessage = '';
      
      // Check if image file is provided
      if (!imageFile) {
        this.errorMessage = 'Product image is required. Please select an image.';
        return;
      }
      
      // Use FormData to properly handle file uploads
      const formData = new FormData();
      formData.append('name', newProduct.name);
      formData.append('description', newProduct.description || '');
      formData.append('price', newProduct.price);
      formData.append('stock', newProduct.stock);
      
      // Add the image file
      formData.append('image', imageFile);

      console.log('Sending product data with FormData');
      
      // Use FormData with the correct content type
      axios.post('/api/employee/products/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          console.log('Product added successfully:', response.data);
          this.SET_PRODUCTS([...this.products, response.data]);
          this.showAddModal = false;
        })
        .catch(error => {
          console.error('Error adding product:', error);
          
          if (error.response && error.response.data) {
            // Format validation errors for display
            if (typeof error.response.data === 'object') {
              const errorMessages = [];
              for (const field in error.response.data) {
                errorMessages.push(`${field}: ${error.response.data[field]}`);
              }
              this.errorMessage = errorMessages.join(', ');
            } else {
              this.errorMessage = error.response.data;
            }
          } else {
            this.errorMessage = 'Failed to add product. Please check the form data and try again.';
          }
        });
    },
    
    editProduct(product) {
      this.selectedProduct = { ...product };
      this.showEditModal = true;
    },
    
    updateProduct(data) {
      // Clear any previous error
      this.errorMessage = '';
      
      // If we have formData (for image uploads), use it
      if (data.formData) {
        axios.put(`/api/employee/products/${data.id}/`, data.formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
          .then(response => {
            console.log('Product updated successfully:', response.data);
            const updated = this.products.map(p => 
              p.id === data.id ? response.data : p
            );
            this.SET_PRODUCTS(updated);
            this.showEditModal = false;
          })
          .catch(error => {
            console.error('Error updating product:', error);
            this.handleUpdateError(error);
          });
      } else {
        // Use regular JSON data if no formData provided
        axios.put(`/api/employee/products/${data.id}/`, data.product)
          .then(response => {
            console.log('Product updated successfully:', response.data);
            const updated = this.products.map(p => 
              p.id === data.id ? response.data : p
            );
            this.SET_PRODUCTS(updated);
            this.showEditModal = false;
          })
          .catch(error => {
            console.error('Error updating product:', error);
            this.handleUpdateError(error);
          });
      }
    },
    
    handleUpdateError(error) {
      if (error.response && error.response.data) {
        // Format validation errors for display
        if (typeof error.response.data === 'object') {
          const errorMessages = [];
          for (const field in error.response.data) {
            errorMessages.push(`${field}: ${error.response.data[field]}`);
          }
          this.errorMessage = errorMessages.join(', ');
        } else {
          this.errorMessage = error.response.data;
        }
      } else {
        this.errorMessage = 'Failed to update product. Please check the form data and try again.';
      }
    },
    
    removeProduct(id) {
      // Check if product is in orders first
      axios.get(`/api/employee/products/${id}/check_ordered/`)
        .then(response => {
          const inOrders = response.data.in_orders;
          
          if (inOrders) {
            this.errorMessage = 'This product cannot be deleted because it has been ordered by customers.';
            return;
          }
          
          // If not in orders, show confirmation dialog
          if (confirm('Are you sure you want to delete this product?')) {
            this.deleteProduct(id);
          }
        })
        .catch(error => {
          console.error('Error checking product orders:', error);
          this.errorMessage = 'Could not verify if product is in orders. Delete operation canceled.';
        });
    },
    
    deleteProduct(id) {
      axios.delete(`/api/employee/products/${id}/`)
        .then(() => {
          const updated = this.products.filter(p => p.id !== id);
          this.SET_PRODUCTS(updated);
          // Success message
          this.errorMessage = ''; // Clear any previous errors
        })
        .catch(error => {
          console.error('Error deleting product:', error);
          
          // Check if error is due to product being in orders
          if (error.response && error.response.data && 
              (error.response.data.detail || '').includes('cannot be deleted')) {
            this.errorMessage = 'This product cannot be deleted because it has been ordered by customers.';
          } else {
            // If deletion failed for other reasons, show a more generic error
            this.errorMessage = 'Error deleting product. It may be referenced in orders.';
          }
          
          // Refresh product list to ensure UI is in sync with backend
          this.loadProducts();
        });
    }
  },
  created() {
    this.loadProducts();
  }
};
</script>

<style scoped>
.card-header {
  font-weight: bold;
}

/* Ensure buttons inside the table are appropriately sized */
.table td button {
  width: 100%;
  margin: 5px 0;
}

.table-responsive {
  overflow-x: auto;
}


/* Adjust table layout for smaller screens */
@media (max-width: 768px) {
  .table thead {
    display: none;
  }

  .table, .table tbody, .table tr, .table td {
    display: block;
    width: 100%;
  }

  .table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  .table td::before {
    content: attr(data-label);
    position: absolute;
    left: 10px;
    font-weight: bold;
  }

  .table td button {
    width: auto;
    margin: 5px;
  }
}
</style>
