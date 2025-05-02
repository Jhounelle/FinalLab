<template>
  <div class="admin-panel">
    <h2>Admin Panel</h2>
    
    <!-- Tab Navigation -->
    <ul class="nav nav-tabs" id="adminTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="manage-products-tab" data-bs-toggle="tab" href="#manage-products" role="tab" aria-controls="manage-products" aria-selected="true">Manage Products</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="view-transactions-tab" data-bs-toggle="tab" href="#view-transactions" role="tab" aria-controls="view-transactions" aria-selected="false">View Transactions</a>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content" id="adminTabsContent">
      
      <!-- Manage Products Tab -->
      <div class="tab-pane fade show active" id="manage-products" role="tabpanel" aria-labelledby="manage-products-tab">
        <div class="product-list">
          <h3>Product List</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td>{{ product.name }}</td>
                <td>{{ product.price }}</td>
                <td>
                  <button class="btn btn-warning" @click="editProduct(product.id)">Edit</button>
                  <button class="btn btn-danger" @click="deleteProduct(product.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          <button class="btn btn-primary" @click="showAddProductModal">Add Product</button>
        </div>

        <!-- Add/Edit Product Modal -->
        <div class="modal" tabindex="-1" :class="{'d-block': showModal}" style="display: block;">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">{{ isEditMode ? 'Edit Product' : 'Add Product' }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
              </div>
              <div class="modal-body">
                <form @submit.prevent="saveProduct">
                  <div class="mb-3">
                    <label for="productName" class="form-label">Product Name</label>
                    <input type="text" id="productName" v-model="product.name" class="form-control" required>
                  </div>
                  <div class="mb-3">
                    <label for="productPrice" class="form-label">Price</label>
                    <input type="number" id="productPrice" v-model="product.price" class="form-control" required>
                  </div>
                  <button type="submit" class="btn btn-success">{{ isEditMode ? 'Update' : 'Add' }} Product</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View Transactions Tab -->
      <div class="tab-pane fade" id="view-transactions" role="tabpanel" aria-labelledby="view-transactions-tab">
        <h3>Transaction History</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="transaction in transactions" :key="transaction.id">
              <td>{{ transaction.id }}</td>
              <td>{{ transaction.customerName }}</td>
              <td>${{ transaction.total }}</td>
              <td>{{ transaction.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      products: [], // List of products
      transactions: [], // List of transactions
      product: { name: '', price: 0 }, // Product object for Add/Edit
      showModal: false, // To toggle modal visibility
      isEditMode: false, // If true, it's edit mode
      currentProductId: null // Used to identify the product being edited
    };
  },
  created() {
    this.fetchProducts();
    this.fetchTransactions();
  },
  methods: {
    fetchProducts() {
      // Fetch products from an API or Vuex store
      // For now, it's mocked
      this.products = [
        { id: 1, name: 'Product 1', price: 20.0 },
        { id: 2, name: 'Product 2', price: 30.0 }
      ];
    },
    fetchTransactions() {
      // Fetch transactions from an API or Vuex store
      // For now, it's mocked
      this.transactions = [
        { id: 101, customerName: 'John Doe', total: 50.0, status: 'Completed' },
        { id: 102, customerName: 'Jane Smith', total: 70.0, status: 'Pending' }
      ];
    },
    showAddProductModal() {
      this.showModal = true;
      this.isEditMode = false;
      this.product = { name: '', price: 0 }; // Reset the product form
    },
    closeModal() {
      this.showModal = false;
    },
    saveProduct() {
      if (this.isEditMode) {
        // Update product logic (e.g., send PUT request to server)
        alert(`Product ${this.product.name} updated!`);
      } else {
        // Add new product logic (e.g., send POST request to server)
        alert(`Product ${this.product.name} added!`);
      }

      // After saving, close the modal and refresh product list
      this.showModal = false;
      this.fetchProducts();
    },
    editProduct(productId) {
      this.currentProductId = productId;
      this.isEditMode = true;
      const product = this.products.find(p => p.id === productId);
      this.product = { ...product }; // Populate the product form with the selected product
      this.showModal = true;
    },
    deleteProduct(productId) {
      // Delete product logic (e.g., send DELETE request to server)
      this.products = this.products.filter(p => p.id !== productId);
      alert('Product deleted!');
    }
  }
};
</script>

<style scoped>
.admin-panel {
  margin: 20px;
}

.nav-tabs {
  margin-bottom: 20px;
}

.table {
  margin-bottom: 20px;
}

.modal {
  background-color: rgba(0, 0, 0, 0.5);
}

.product-list {
  margin-bottom: 20px;
}

.product-list .btn {
  margin-right: 10px;
}
</style>
