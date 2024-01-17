<template>
    <div class="fontSize container justify-content-center">
        <table striped hover :items="products" class="mt-3" responsive style="color: whitesmoke;">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(product, index) in sortedProducts" :key="product.ID">
                    <td class="col-md-1">{{index + 1}}</td>
                    <td class="col-md-1">{{product.Name}}</td>
                    <td class="col-md-1">{{product.Quantity}}</td>
                    <td class="col-md-1">{{product.UnitPrice}}</td>
                    <td class="col-md-1">{{product.TotalPrice}}</td>
                    <td class="col-md-1">
                        <button type="button" class="btn btn-primary g1" 
                        @click="AddProduct(product.ID)">+</button>
                        <button type="button" class="btn btn-primary g1" 
                        @click="RemoveProduct(product.ID)">-</button>
                    </td>
                    <td class="col-md-1"><button type="button" class="btn btn-primary" 
                        @click="DeleteFromCart(product.ID)">Delete</button></td>
                </tr>
            </tbody>
        </table>
        <h3>Łączna cena: {{ totalCost }}</h3>
    </div>

    <div class="container mt-5 col-md-5">
        <form>
            <div class="form-group">
                <label for=inputUserName>Imię użytkownika</label>
                <input type="text" id=inputUserName class="form-control" v-model="userName" placeholder="Wpisz imię użytkowanika" />
            </div>

            <div class="form-group">
                <label for=inputEmail>Adres Email</label>
                <input type="text" id=inputEmail class="form-control" v-model="email" placeholder="Wpisz swój email" />
            </div>

            <div class="form-group">
                <label for=inputPhone>Numer telefonu</label>
                <input type="text" id=inputPhone class="form-control" v-model="phone" placeholder="Wpisz swój numer telefonu" />
            </div>

            <div class="form-group row justify-content-center">
                <input type="button" class="btn btn-warning g1" @click="Order" value="Złóż zamówienie" />
            </div>
        </form>
    </div>
</template>

<script>
import axios from 'axios'

export default {
    
    props: {
        products: Array
    },

    data(){
        return {
            sortedProducts: [],
            totalCost: 0,
            userName: '',
            email: '',
            phone: ''
        }
    },

    watch: { 
        products: function() { 
            this.handleProductChange();
                }
      },

    mounted() {
        this.handleProductChange();
    },

    methods: {
        DeleteFromCart(id) {
            this.$emit('DeleteFromCart', id);
        },

        handleProductChange() {
            this.sortedProducts.splice(0,this.sortedProducts.length);
            this.totalCost = 0;


            this.products.forEach(product => {
            if (!this.sortedProducts.some(sortedProduct => sortedProduct.ID === product.ID)) {
                const newProduct = {
                    ID: product.ID,
                    Name: product.Name,
                    Quantity: 1,
                    UnitPrice: product.UnitPrice,
                    TotalPrice: product.UnitPrice
                };
                this.sortedProducts.push(newProduct);
                this.totalCost += product.UnitPrice;
            } else {
                this.sortedProducts.forEach(sortedProduct => {
                    if (sortedProduct.ID === product.ID) {
                        sortedProduct.Quantity += 1;
                        sortedProduct.TotalPrice += sortedProduct.UnitPrice;
                        this.totalCost += sortedProduct.UnitPrice;
                    }
                });
            }
        });
        },

        AddProduct(id) {
            this.$emit('AddToCart', id);
            this.handleProductChange();
        },

        RemoveProduct(id) {
            this.$emit('RemoveFromCart', id);
            this.handleProductChange();
        },

        async Order() {
            if (!(this.userName.match(/^[a-z]+$/i))) {
                alert('Username can only contain letters');
                return;
            }     

            if (!this.email.includes("@")) {
                alert('Invalid email (Correct example: \'aji@gmail.com\'');
                return;
            }

            const pattern = /^[0-9\s+]+$/;
            if(!pattern.test(this.phone)) {
                alert('Invalid phone number (Correct example: \'+48 111 111 111\'');
                return;
            }
            
            if(this.sortedProducts.length === 0) {
                alert('Order cannot be empty');
                return;
            }
            
            

            const order = {
                orderStatusId: 1,
                userName: this.userName,
                email: this.email,
                phoneNumber: this.phone
            };

            const response = await axios.post('http://localhost:3000/orders', order);

            console.log(response.data.Id);
            
            this.sortedProducts.forEach(async product => {
                const sendItem = {
                    productId: product.ID,
                    orderId: response.data.Id,
                    quantity: product.Quantity
                }
                await axios.post('http://localhost:3000/orderItem', sendItem);
            });
        }
    }
}

</script>