<template>
  <div class="admin-panel">
    <h2>Admin Panel</h2>
    
    <ul class="nav nav-tabs" id="adminTabs" role="tablist">
      <li class="nav-item" role="presentation">
        <a class="nav-link active" id="manage-products-tab" data-bs-toggle="tab" href="#manage-products" role="tab" aria-controls="manage-products" aria-selected="true">Manage Products</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="view-transactions-tab" data-bs-toggle="tab" href="#view-transactions" role="tab" aria-controls="view-transactions" aria-selected="false">View Transactions</a>
      </li>
    </ul>

    <div class="tab-content" id="adminTabsContent">
      
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
      products: [], 
      transactions: [], 
      product: { name: '', price: 0 }, 
      showModal: false, 
      isEditMode: false, 
      currentProductId: null 
    };
  },
  created() {
    this.fetchProducts();
    this.fetchTransactions();
  },
  methods: {
    fetchProducts() {

      this.products = [
        { id: 1, name: 'Product 1', price: 20.0 },
        { id: 2, name: 'Product 2', price: 30.0 }
      ];
    },
    fetchTransactions() {

      this.transactions = [
        { id: 101, customerName: 'John Doe', total: 50.0, status: 'Completed' },
        { id: 102, customerName: 'Jane Smith', total: 70.0, status: 'Pending' }
      ];
    },
    showAddProductModal() {
      this.showModal = true;
      this.isEditMode = false;
      this.product = { name: '', price: 0 }; 
    },
    closeModal() {
      this.showModal = false;
    },
    saveProduct() {
      if (this.isEditMode) {
       
        alert(`Product ${this.product.name} updated!`);
      } else {
     
        alert(`Product ${this.product.name} added!`);
      }

      this.showModal = false;
      this.fetchProducts();
    },
    editProduct(productId) {
      this.currentProductId = productId;
      this.isEditMode = true;
      const product = this.products.find(p => p.id === productId);
      this.product = { ...product }; 
      this.showModal = true;
    },
    deleteProduct(productId) {

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
