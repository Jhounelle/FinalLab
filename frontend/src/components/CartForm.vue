<!-- src/components/CartForm.vue -->
<template>
  <form>
    <div class=" container mb-3">
      <label for="exampleInput" class="form-label">Sample Field</label>
      <input type="text" class="form-control" id="exampleInput">
    </div>
    <button type="submit" class="btn btn-primary">Checkout</button>
  </form>
</template>

<script>
export default {
  name: 'CartForm'
};
</script>

<style>

 container{
  z-index: 9999;
 }

</style>
