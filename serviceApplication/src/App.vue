<template>
  <div id="app" style="color: wheat;">
    <div class="container d-flex justify-content-between align-items-center mb-3">
      <div>
        <h1>Sklep internetowy (wersja dla pracowników)</h1>
      </div>
    </div>

    
      <FiltrComponent :products="products" @filter="FilterProducts"/>
      <ProductsComponent :products="filteredProducts" @FetchAllProducts="FetchAllProducts" @FetchAllOrders="FetchAllOrders"/> 
      <ChangeOrdersComponent :orders="orders" :flag="flag" @Approve="Approve" @Complete="Complete" @Cancel="Cancel"/>   
      <StatusOrdersComponent :orders="allOrders"/>
  </div>
</template>

<script>
import FiltrComponent from './components/FiltrComponent.vue';
import ProductsComponent from './components/ProductsComponent.vue';
import ChangeOrdersComponent from './components/ChangeOrdersComponent.vue';
import StatusOrdersComponent from './components/StatusOrdersComponent.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    FiltrComponent,
    ProductsComponent,
    ChangeOrdersComponent,
    StatusOrdersComponent,
},

  data() {
    return {
      image: {backgroundImage: "~@/assets/logo.png"},
      products: [],
      orders: [],
      allOrders: [],
      filteredProducts: [],
      cartProducts: [],
      flag: 0,
      };
  },
  
  mounted() {
    this.FetchAllProducts();
    this.FetchAllOrders();
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

    async FetchAllOrders() {
      this.orders = [];
      this.allOrders = [];
      try {
        const response = await axios.get('http://localhost:3000/orders');
        response.data.forEach(order => {
          if (order.OrderStatusId === 1 || order.OrderStatusId === 2) {
            this.orders.push(order);
            this.allOrders.push(order);
          } else {
            this.allOrders.push(order);
          }
        });
      } catch (error) {
        console.error('Error fetching orders: ', error);
      }
      this.flag += 1;
    },

    async Approve(id) {
      try {
          const date = new Date();
          const year = date.getFullYear();
          const month = date.getMonth();
          const day = date.getDate();
          const hour = date.getHours();
          const minute = date.getMinutes();

          const approvalDate = `${year}-${month+1}-${day} ${hour}:${minute}`;

        let patch = [{
          op: 'replace', 
          path: '/OrderStatusId', 
          value: 2
        },{
          op: 'replace',
          path: '/ApprovalDate',
          value: approvalDate
        }];
        await axios.patch('http://localhost:3000/orders/' + id, patch);
      } catch (err) {
        alert(err.response.statusText);
      }

      this.FetchAllProducts();
      this.FetchAllOrders();
    },

    async Complete(id) {
      try {
        let patch = [{
          op: 'replace', 
          path: '/OrderStatusId', 
          value: 4
        }];
        await axios.patch('http://localhost:3000/orders/' + id, patch);
      } catch (err) {
        console.log(err.response);
        alert(err.response.statusText);
      }

      this.FetchAllProducts();
      this.FetchAllOrders();
    },

    async Cancel(id) {
      try {
        let patch = [{
          op: 'replace', 
          path: '/OrderStatusId', 
          value: 3
        }];
        await axios.patch('http://localhost:3000/orders/' + id, patch);
      } catch (err) {
        console.log(err.response);
        alert(err.response.statusText);
      }

      this.FetchAllProducts();
      this.FetchAllOrders();
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
