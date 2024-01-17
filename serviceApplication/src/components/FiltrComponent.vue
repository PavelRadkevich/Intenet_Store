<template>
    <div style="color: wheat;">
        <div id="app">
            <div class="container">
                        <form>
                            <div class="form-group">
                                <label for=inputName>Nazwa</label>
                                <input type="text" id=inputName class="form-control" v-model="name" placeholder="Wpisz nazwę towaru który chcesz znaleźć" />
                            </div>

                            <div class="form-group">
                                <label for=inputDescription>Opis</label>
                                <input type="text" id=inputDescription class="form-control" v-model="description" placeholder="Wpisz opis towaru który chcesz znaleźć" />
                            </div>

                            <div class="form-group">
                                <label for="selectCategory">Kategoria</label>
                                <select id="selectCategory" class="form-control" v-model="category">
                                <!-- Add options for each category -->
                                <option value="">Wybierz kategorię</option>
                                <option v-for="category in categories" :key="category.id" :value="category.name">{{ category.name }}</option>
                                </select>
                            </div>

                            <div class="form-group row justify-content-center">
                                <input type="button" class="g1 col-sm-1" @click="filterProduct" value="Szukaj" />
                            </div>
                        </form>
                    </div>
            </div>
            </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
        name: '',
        category: '',
        description: '',
        categories: [
            { id: 1, name: 'Home' },
            { id: 2, name: 'Games' },
            { id: 2, name: 'Sport' },
            { id: 2, name: 'Food' },
            { id: 2, name: 'Clothes' },
        ],
        filteredProducts: [],
    };
  },

  props: {
    products: Array,
  },

  methods: {
    async filterProduct() {
        const filteredProducts = await Promise.all(
            this.products.map(async (product) => {
                const nameCondition = this.name === 0 || product.Name.toLowerCase()
                .includes(this.name.toLowerCase());

                const descriptionCondition = this.description === 0 || product.Description.toLowerCase()
                .includes(this.description.toLowerCase());

                const response = await axios.get(`http://localhost:3000/categories/${product.CategoryId}`);
                const nameOfCategory = response.data[0].Name;
                const categoryCondition = this.category === 0 || nameOfCategory
                .includes(this.category);

                return nameCondition && descriptionCondition && categoryCondition ? product : null;
            })
        );

    this.filteredProducts = filteredProducts.filter((product) => product !== null);

    this.$emit('filter', this.filteredProducts);
    },
  },
};
</script>


<style>

</style>