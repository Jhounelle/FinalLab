<template>
    <div class="modal d-block" tabindex="-1" role="dialog" @click.self="$emit('close')">
      <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Edit Product</h5>
            <button type="button" class="close" @click="$emit('close')">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submit" enctype="multipart/form-data">
              <div class="row g-3">
                <div class="col-md-6">
                  <input type="text" v-model="product.name" class="form-control" placeholder="Product Name" required />
                </div>
                <div class="col-md-3">
                  <input type="number" v-model="product.price" class="form-control" placeholder="Price" required />
                </div>
                <div class="col-md-3">
                  <input type="number" v-model="product.stock" class="form-control" placeholder="Stock" required />
                </div>
                <div class="col-md-12 mt-2">
                  <input type="text" v-model="product.description" class="form-control" placeholder="Description" />
                </div>
                
                <!-- Current Image Preview -->
                <div v-if="currentImageUrl" class="col-md-12 mt-3 text-center">
                  <p>Current Image:</p>
                  <img :src="currentImageUrl" class="img-thumbnail" style="max-height: 200px;" alt="Current product image" />
                </div>
                
                <div class="col-md-12 mt-3">
                  <label class="form-label">Upload New Image</label>
                  <input type="file" @change="handleImageUpload" class="form-control" accept="image/*" />
                  <small class="text-muted">Products must have an image. If you don't upload a new one, the current image will be kept.</small>
                </div>
              </div>
              <div class="modal-footer">
                <button class="btn btn-secondary" type="button" @click="$emit('close')">Cancel</button>
                <button class="btn btn-success" type="submit">Update Product</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { getImageUrl } from '../utils/imageHelper';

  export default {
    props: ['existingProduct'],
    data() {
      return {
        product: { ...this.existingProduct },
        imageFile: null // Store the actual file object
      };
    },
    computed: {
      currentImageUrl() {
        if (!this.product.image) return null;
        return getImageUrl(this.product.image);
      }
    },
    methods: {
      submit() {
        if (!this.product.name || !this.product.price) {
          alert('Please fill in all required fields.');
          return;
        }
        
        if (parseFloat(this.product.price) <= 0) {
          alert('Price must be greater than zero.');
          return;
        }
        
        if (parseInt(this.product.stock) < 0) {
          alert('Stock cannot be negative.');
          return;
        }
        
        // Use FormData to properly handle file uploads
        const formData = new FormData();
        formData.append('name', this.product.name);
        formData.append('description', this.product.description || '');
        formData.append('price', parseFloat(this.product.price));
        formData.append('stock', parseInt(this.product.stock));
        
        // Only append image if a new file was selected
        if (this.imageFile) {
          formData.append('image', this.imageFile);
        }
        
        this.$emit('update-product', { 
          id: this.product.id,
          formData,
          product: {
            ...this.product,
            price: parseFloat(this.product.price),
            stock: parseInt(this.product.stock)
          }
        });
      },
      handleImageUpload(event) {
        const file = event.target.files[0];
        if (file) {
          this.imageFile = file;
          
          // Preview the new image
          const reader = new FileReader();
          reader.onload = () => {
            // Just for preview - this doesn't affect the actual product.image yet
            this.product.imagePreview = reader.result;
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .modal {
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .modal-dialog {
    max-width: 600px;
    width: 100%;
  }
  
  .modal-content {
    background-color: #fff;
    border-radius: 8px;
    padding: 20px;
  }
  
  .modal-header {
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .modal-title {
    font-size: 1.5rem;
    font-weight: 600;
  }
  
  .close {
    font-size: 1.5rem;
    border: none;
    background: transparent;
    color: #aaa;
  }
  
  .close:hover {
    color: #333;
  }
  
  .modal-body {
    padding-top: 15px;
  }
  
  .form-control {
    border-radius: 5px;
    padding: 10px;
    font-size: 1rem;
  }
  
  .modal-footer {
    padding-top: 15px;
    display: flex;
    justify-content: flex-end;
  }
  
  .modal-footer button {
    padding: 10px 20px;
    font-size: 1rem;
  }
  
  .btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
  }
  
  .btn-secondary:hover {
    background-color: #5a6268;
    border-color: #545b62;
  }
  
  .btn-success {
    background-color: #28a745;
    border-color: #28a745;
  }
  
  .btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }
  
  @media (max-width: 576px) {
    .modal-dialog {
      max-width: 100%;
      margin: 10px;
    }
  
    .modal-body input,
    .modal-body textarea {
      font-size: 0.9rem;
    }
  }
  </style>
  