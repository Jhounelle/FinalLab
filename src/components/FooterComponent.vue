<template>
  <footer class="footer">
    <p>&copy; 2025 Scentora. All rights reserved.</p>
  </footer>
</template>

<script>
export default {
  name: "FooterComponent",
}
</script>


<style scoped>

.footer {
  display: flex;
  text-align: left;
  align-items: center;       
  background-color: #29000A;
  color:rgb(188, 188, 188);
  padding: 10px 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 300;
  font-size: 0.8rem;
  margin-top: auto;   
}

p {
    padding-top: 20px;
}

</style>
