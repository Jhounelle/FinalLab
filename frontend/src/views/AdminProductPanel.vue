<template>
  <div class="container mt-4">
    <h2 class="mb-4">Admin Panel</h2>

    <button class="btn btn-primary mb-3" @click="showAddModal = true">Add Product</button>

    <div class="table-responsive">
      <table class="table table-bordered table-striped">
        <thead class="table-light">
          <tr>
            <th>Name</th>
            <th class="description-column">Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th style="width: 120px;">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td>{{ product.name }}</td>
            <td class="description-column">{{ product.description }}</td>
            <td>₱{{ product.price }}</td>
            <td>{{ product.stock }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-2" @click="editProduct(product)">Edit</button>
              <button class="btn btn-sm btn-danger" @click="removeProduct(product.id)">Delete</button>
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
import { mapState, mapMutations } from 'vuex';
import AddProductModal from '@/components/AddProductModal.vue';
import EditProductModal from '@/components/EditProductModal.vue';

export default {
  components: {
    AddProductModal,
    EditProductModal
  },
  data() {
    return {
      showAddModal: false,
      showEditModal: false,
      selectedProduct: null
    };
  },
  computed: {
    ...mapState(['products'])
  },
  methods: {
    ...mapMutations(['SET_PRODUCTS']),
    addProduct(product) {
      this.SET_PRODUCTS([...this.products, product]);
    },
    removeProduct(id) {
      const updated = this.products.filter(p => p.id !== id);
      this.SET_PRODUCTS(updated);
    },
    editProduct(product) {
      this.selectedProduct = { ...product };
      this.showEditModal = true;
    },
    updateProduct(updatedProduct) {
      const updated = this.products.map(p => (p.id === updatedProduct.id ? updatedProduct : p));
      this.SET_PRODUCTS(updated);
    }
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
