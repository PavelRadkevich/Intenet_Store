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
                    <th>Category</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in products" :key="product.ID">
                    <td class="col-md-1">{{index + 1}} 

                    </td>
                    <td class="col-md-1">{{product.Name}}
                        <div class="form-group">
                            <input type="text" class="form-control" v-model="product.newName" placeholder="Nowa nazwa" />
                        </div>
                    </td>
                    <td class="col-md-1">{{product.Description}}
                        <div class="form-group">
                            <input type="text" class="form-control" v-model="product.newDescription" placeholder="Nowy opis" />
                        </div>
                    </td>
                    <td class="col-md-1">{{product.UnitPrice}}
                        <div class="form-group">
                            <input type="text" class="form-control" v-model="product.newPrice" placeholder="Nowa cena" />
                        </div>
                    </td>
                    <td class="col-md-1">{{product.UnitWeight}}
                        <div class="form-group">
                            <input type="text" class="form-control" v-model="product.newWeight" placeholder="Nowa waga" />
                        </div>
                    </td>
                    <td class="col-md-1">{{categories[product.CategoryId - 1].name}}
                        <div class="form-group">
                            <input type="text" class="form-control" v-model="product.newCategory" placeholder="Nowa categoria" />
                        </div>
                    </td>
                    <td class="col-md-1"><button type="button" class="btn btn-primary" 
                        @click="AcceptChanges(product.ID)">Accept changes</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        products: Array
    },

    data() {
        return {
            categories: [
            { id: 1, name: 'Home' },
            { id: 2, name: 'Games' },
            { id: 3, name: 'Sport' },
            { id: 4, name: 'Food' },
            { id: 5, name: 'Clothes' },
        ],
        }
    },

    methods: {
        async AcceptChanges(id) {
            const oldProduct = this.products[id - 1];
            let newProduct = {
                id: '',
                name: '',
                description: '',
                unitPrice: '',
                unitWeight: '',
                categoryId: ''
            };
            newProduct.id = oldProduct.ID;
            if (oldProduct.newName){
                newProduct.name = oldProduct.newName;
            } else {
                newProduct.name = oldProduct.Name;
            }

            if (oldProduct.newDescription) {
                newProduct.description = oldProduct.newDescription;
            } else {
                newProduct.description = oldProduct.Description;
            }

            if (oldProduct.newPrice) {
                newProduct.unitPrice = oldProduct.newPrice;
            } else {
                newProduct.unitPrice = oldProduct.UnitPrice;
            } 

            if (oldProduct.newWeight) {
                newProduct.unitWeight = oldProduct.newWeight; 
            } else {
                newProduct.unitWeight = oldProduct.UnitWeight;
            }

            if (oldProduct.newCategory) {
                const newCategoryId = this.categories.findIndex(c => c.name === oldProduct.newCategory) + 1;
                if (newCategoryId === 0 ) {
                    alert('Srawdz nazwę categorii którą wpisałeś');
                    return;
                }
                newProduct.categoryId = newCategoryId;
            } else {
                newProduct.categoryId = oldProduct.CategoryId;
            }
            console.log(newProduct);
            try {
                await axios.put('http://localhost:3000/products/' + newProduct.id, newProduct);
            } catch (err) {
                alert(err.response.data.error);
                return;
            }

            this.$emit('FetchAllProducts');
            this.$emit('FetchAllOrders');

        }
    }
}

</script>

<style>
.fontSize {
    font-size: 2.5vh;
}
</style>