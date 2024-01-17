<template>
  <div id="app" style="color: wheat;">
    <div class="container d-flex justify-content-between align-items-center mb-3">
      <div v-if="$route.path != '/cart'" >
        <h1>Sklep internetowy</h1>
      </div>
      <div>
        <router-link v-if="$route.path != '/cart'" to="/cart">
          <button type="button" class="btn btn-primary g1">Przejdż do podsumowania</button>
        </router-link>
      </div>
    </div>

    
      <FiltrComponent  v-if="$route.path != '/cart'" :products="products" @filter="FilterProducts"/>
      <TableComponent v-if="$route.path != '/cart'" :products="filteredProducts" @AddToCart="AddToCart"/>
      
      <router-view>
        <CartView v-if="$route.path === '/cart'"/>
        <CartComponent v-if="$route.path === '/cart'" :products="cartProducts" @DeleteFromCart="DeleteFromCart" :handleProductChange="handleProductChange" @AddToCart="AddToCart" @RemoveFromCart="RemoveFromCart"/>
      </router-view>
      
  </div>
</template>

<script>
import FiltrComponent from './components/FiltrComponent.vue';
import TableComponent from './components/TableComponent.vue';
import CartComponent from './components/CartComponent.vue';
import CartView from './views/CartView.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    FiltrComponent,
    TableComponent,
    CartView,
    CartComponent
},

  data() {
    return {
      image: {backgroundImage: "~@/assets/logo.png"},
      products: [],
      filteredProducts: [],
      cartProducts: [],
      };
  },
  
  mounted() {
    this.FetchAllProducts();
  },

  methods: {
    async FetchAllProducts() {
      try {
        const response = await axios.get('http://localhost:3000/products');
        this.products = response.data;
        this.filteredProducts = this.products;
      } catch (error) {
        console.error('Error fetching products: ', error);
      }
    },

    FilterProducts(filteredProducts) {
      this.filteredProducts = filteredProducts;
    },

    AddToCart(id) {
      const productToCart = this.products.find(product => id === product.ID);
      this.cartProducts.push(productToCart);
    },

    DeleteFromCart(id) {
      this.cartProducts = this.cartProducts.filter((product) => product.ID !== id);
      console.log(this.cartProducts);
    },

    RemoveFromCart(id) {
      const indexToRemove = this.cartProducts.findIndex(product => product.ID === id);

      if (indexToRemove !== -1) {
        this.cartProducts.splice(indexToRemove, 1);
      }
    }
  }
}
</script>

<style>
@import '~bootstrap/dist/css/bootstrap.css';
body {
  background-image: url('@/assets/background.jpg');
}

.g1 {
  background-color: wheat;
  color: black;
  border-color: wheat;
  border-radius: 10%;
  height: 5vh;
}
</style>
