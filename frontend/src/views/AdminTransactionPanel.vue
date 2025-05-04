<template>
  <div class="container mt-4">
    <h2 class="mb-4">Admin Panel</h2>

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
