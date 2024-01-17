<template>
    <div class="fontSize container justify-content-center">
        <table striped hover :items="products" class="mt-3" responsive style="color: whitesmoke;">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Unit Price</th>
                    <th>Unit Weight</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in products" :key="product.ID">
                    <td class="col-md-1">{{index + 1}}</td>
                    <td class="col-md-1">{{product.Name}}</td>
                    <td class="col-md-1">{{product.Description}}</td>
                    <td class="col-md-1">{{product.UnitPrice}}</td>
                    <td class="col-md-1">{{product.UnitWeight}}</td>
                    <td class="col-md-1"><button type="button" class="btn btn-primary" 
                        @click="AddToCart(product.ID)">Add to cart</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        products: Array
    },

    methods: {
        AddToCart(id) {
            this.$emit('addToCart', id);
        }
    }
}

</script>

<style>
.fontSize {
    font-size: 2.5vh;
}
</style>