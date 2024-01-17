
import CartComponentVue from '@/components/CartComponent.vue';
<template>
    <div id="app" class="container d-flex justify-content-between align-items-center mb-3" style="color: wheat;">
      <div>
        <h1>Sklep internetowy</h1>
      </div>
      <div>
        <router-link  to="/">
          <button type="button" class="btn btn-primary g1">Wróć</button>
        </router-link>
      </div>
    </div>

    <div class="container text-center">
        <h1>Podsumowanie zamówienia</h1>
    </div>
    
</template>

<script>
//import CartComponent from '@/components/CartComponent.vue';

export default {
    name: 'CartView',
    

}
</script>

<style>
</style>