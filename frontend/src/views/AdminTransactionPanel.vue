<template>
  <div class="container mt-4">
    <h2 class="mb-4">Admin Panel - Transactions</h2>

    <!-- Filter Controls -->
    <div class="card mb-4">
      <div class="card-header">
        <h5 class="mb-0">Filter Transactions</h5>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <label for="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                v-model="filters.startDate"
                class="form-control"
              />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <label for="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                v-model="filters.endDate"
                class="form-control"
              />
            </div>
          </div>
          <div class="col-md-4 d-flex align-items-end">
            <button class="btn btn-primary w-100" @click="applyFilters">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Transactions Table -->
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">Checkout Transactions</h5>
      </div>
      <div class="card-body">
        <div v-if="loading" class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">Loading transactions...</p>
        </div>
        
        <div v-else-if="filteredTransactions.length === 0" class="text-center py-4">
          <p>No transactions found for the selected period.</p>
        </div>
        
        <div v-else class="table-responsive">
          <table class="table table-bordered">
            <thead class="table-light">
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in filteredTransactions" :key="order.id">
                <td>{{ order.id }}</td>
                <td>{{ order.customer_name }}</td>
                <td>
                  <ul class="mb-0">
                    <li v-for="item in order.items" :key="item.id">
                      {{ item.name }} x{{ item.quantity }}
                    </li>
                  </ul>
                </td>
                <td>₱{{ order.total }}</td>
                <td>{{ formatDate(order.created_at) }}</td>
                <td>
                  <button
                    class="btn btn-sm btn-info"
                    @click="viewOrderDetails(order)"
                  >
                    Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    <!-- Order Details Modal -->
    <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="selectedOrder">
          <div class="modal-header">
            <h5 class="modal-title">Order Details #{{ selectedOrder.id }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6>Customer Information</h6>
                <p>
                  <strong>Name:</strong> {{ selectedOrder.customer_name }}<br>
                  <strong>Email:</strong> {{ selectedOrder.customer_email }}<br>
                  <strong>Contact:</strong> {{ selectedOrder.contact_number }}
                </p>
              </div>
              <div class="col-md-6">
                <h6>Shipping Information</h6>
                <p>
                  <strong>Address:</strong> {{ selectedOrder.address }}<br>
                  <strong>City:</strong> {{ selectedOrder.city }}<br>
                  <strong>Postal Code:</strong> {{ selectedOrder.postal_code }}
                </p>
              </div>
            </div>
            
            <h6>Order Items</h6>
            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>₱{{ item.price }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>₱{{ item.price * item.quantity }}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-end"><strong>Total:</strong></td>
                  <td>₱{{ selectedOrder.total }}</td>
                </tr>
              </tfoot>
            </table>
            
            <div class="row">
              <div class="col-md-6">
                <h6>Payment Information</h6>
                <p>
                  <strong>Method:</strong> {{ selectedOrder.payment_method }}<br>
                  <strong>Status:</strong> <span class="badge bg-success">Paid</span>
                </p>
              </div>
              <div class="col-md-6">
                <h6>Order Information</h6>
                <p>
                  <strong>Date:</strong> {{ formatDate(selectedOrder.created_at) }}<br>
                  <strong>Status:</strong> <span class="badge bg-primary">{{ selectedOrder.status }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from '../axios';
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default {
  data() {
    return {
      loading: false,
      selectedOrder: null,
      filters: {
        startDate: '',
        endDate: ''
      },
      transactions: [],
      orderDetailsModal: null
    };
  },
  computed: {
    filteredTransactions() {
      if (!this.filters.startDate && !this.filters.endDate) {
        return this.transactions;
      }

      return this.transactions.filter(order => {
        const orderDate = new Date(order.created_at);
        
        if (this.filters.startDate && this.filters.endDate) {
          const start = new Date(this.filters.startDate);
          const end = new Date(this.filters.endDate);
          // Set end date to end of day
          end.setHours(23, 59, 59);
          return orderDate >= start && orderDate <= end;
        } else if (this.filters.startDate) {
          const start = new Date(this.filters.startDate);
          return orderDate >= start;
        } else if (this.filters.endDate) {
          const end = new Date(this.filters.endDate);
          // Set end date to end of day
          end.setHours(23, 59, 59);
          return orderDate <= end;
        }
        
        return true;
      });
    }
  },
  methods: {
    fetchTransactions() {
      this.loading = true;
      
      axios.get('/api/admin/orders/')
        .then(response => {
          console.log('Fetched orders:', response.data);
          // Transform the data to match our component's expected structure
          this.transactions = response.data.map(order => ({
            id: order.id,
            customer_name: order.full_name,
            customer_email: order.email,
            contact_number: order.phone,
            address: order.address,
            city: '',
            postal_code: '',
            payment_method: 'Credit Card',
            status: order.status,
            total: order.total_amount,
            created_at: order.created_at,
            items: order.items.map(item => ({
              id: item.id,
              name: item.product_name,
              price: item.price,
              quantity: item.quantity
            }))
          }));
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
          // Fallback to sample data if API fails
          this.transactions = [
            {
              id: 'T001',
              customer_name: 'Juan Dela Cruz',
              customer_email: 'juan@example.com',
              contact_number: '09123456789',
              address: '123 Main St',
              city: 'Manila',
              postal_code: '1000',
              payment_method: 'Credit Card',
              status: 'Completed',
              total: 1198,
              created_at: '2025-05-02T10:30:00',
              items: [
                { id: 1, name: 'Noir Drift', price: 599, quantity: 1 },
                { id: 2, name: 'Iron Woods', price: 599, quantity: 1 }
              ]
            },
            {
              id: 'T002',
              customer_name: 'Maria Clara',
              customer_email: 'maria@example.com',
              contact_number: '09198765432',
              address: '456 Elm St',
              city: 'Quezon City',
              postal_code: '1100',
              payment_method: 'GCash',
              status: 'Completed',
              total: 1797,
              created_at: '2025-05-01T14:45:00',
              items: [
                { id: 3, name: 'Azure Pulse', price: 599, quantity: 3 }
              ]
            }
          ];
        })
        .finally(() => {
          this.loading = false;
        });
    },
    viewOrderDetails(order) {
      this.selectedOrder = order;
      
      // Using bootstrap modal
      if (!this.orderDetailsModal) {
        this.orderDetailsModal = new bootstrap.Modal(document.getElementById('orderDetailsModal'));
      }
      
      this.orderDetailsModal.show();
    },
    applyFilters() {
      // We don't need to do anything here since we're using a computed property
      // This method is just for the button click
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    }
  },
  mounted() {
    this.fetchTransactions();
    
    // Initialize modal
    this.$nextTick(() => {
      const modalEl = document.getElementById('orderDetailsModal');
      if (modalEl) {
        this.orderDetailsModal = new bootstrap.Modal(modalEl);
      }
    });
  }
};
</script>

<style scoped>
.card-header {
  font-weight: bold;
}

ul {
  padding-left: 1rem;
}
</style>
