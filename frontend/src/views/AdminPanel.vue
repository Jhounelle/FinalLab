<template>
  <div class="container mt-4">
    <h2 class="mb-4">Admin Panel</h2>

    <div class="card mb-4">
      <div class="card-header">Manage Products</div>
      <div class="card-body">
        <form @submit.prevent="addProduct">
          <div class="row g-3">
            <div class="col-md-4">
              <input type="text" v-model="newProduct.name" class="form-control" placeholder="Product Name" required />
            </div>
            <div class="col-md-3">
              <input type="number" v-model="newProduct.price" class="form-control" placeholder="Price" required />
            </div>
            <div class="col-md-3">
              <input type="text" v-model="newProduct.description" class="form-control" placeholder="Description" />
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100" type="submit">Add</button>
            </div>
          </div>
        </form>

        <table class="table mt-4 table-bordered table-striped">
          <thead class="table-light">
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Description</th>
              <th style="width: 100px;">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in products" :key="index">
              <td>{{ product.name }}</td>
              <td>{{ product.price }}</td>
              <td>{{ product.description }}</td>
              <td>
                <button class="btn btn-danger btn-sm" @click="removeProduct(product.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card">
      <div class="card-header">Checkout Transactions</div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(order, index) in transactions" :key="index">
              <td>{{ order.id }}</td>
              <td>{{ order.customer }}</td>
              <td>
                <ul class="mb-0">
                  <li v-for="item in order.items" :key="item.name">{{ item.name }} x{{ item.quantity }}</li>
                </ul>
              </td>
              <td>₱{{ order.total }}</td>
              <td>{{ order.date }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  data() {
    return {
      newProduct: {
        name: '',
        price: '',
        description: ''
      },
      transactions: [
        {
          id: 'T001',
          customer: 'Juan Dela Cruz',
          items: [
            { name: 'Product A', quantity: 2 },
            { name: 'Product B', quantity: 1 }
          ],
          total: 500,
          date: '2025-05-02'
        },
        {
          id: 'T002',
          customer: 'Maria Clara',
          items: [{ name: 'Product C', quantity: 3 }],
          total: 750,
          date: '2025-05-01'
        }
      ]
    };
  },
  computed: {
    ...mapState(['products'])
  },
  methods: {
    ...mapMutations(['SET_PRODUCTS']),
    addProduct() {
      const id = Date.now();
      const product = { ...this.newProduct, id };
      this.SET_PRODUCTS([...this.products, product]);
      this.newProduct = { name: '', price: '', description: '' };
    },
    removeProduct(id) {
      const updated = this.products.filter(p => p.id !== id);
      this.SET_PRODUCTS(updated);
    }
  }
};
</script>

<style scoped>
.card-header {
  font-weight: bold;
}
</style>
