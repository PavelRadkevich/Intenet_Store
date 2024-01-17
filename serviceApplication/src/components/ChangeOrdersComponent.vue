<template>
    <div class="fontSize container justify-content-center">
        <h1>Edycja zamówień</h1>
        <table striped hover :items="orders" class="mt-3  table-bordered" responsive style="color: whitesmoke;">
            <thead>
                <tr>
                    <th>Id zamówienia</th>
                    <th>Data zatwierdzenia</th>
                    <th>Produkty</th>
                    <th>Łączna cena</th>
                    <th>Status zamówienia</th>
                    <th>Czynności</th>
                </tr>
            </thead>
            <tbody >
                <tr v-for="(order, index) in orders" :key="order.id">
                    <td class="col-md-1">
                            {{order.Id}} 
                    </td>
                    <td>
                        {{ order.ApprovalDate }}
                    </td>
                    <td>
                        <tr>
                            <th>Nazwa</th>
                            <th>Ilość</th>
                        </tr>
                        <tbody>
                            <tr v-for="(orderItem) in orderItems[index]" :key="orderItem.Id">
                                <td>
                                    {{ orderItem.ProductName }}
                                </td>
                                <td>
                                    {{ orderItem.Quantity }}
                                </td>
                            </tr>
                        </tbody>
                    </td>
                    <td>
                        {{ totalCost[index] }}
                    </td>
                    <td>
                        {{ statuses[order.OrderStatusId - 1] }}
                    </td>
                    <td class="d-flex flex-column align-items-center">
                        <button type="button" class="btn btn-primary g1 my-2" @click="Approve(order.Id, order.OrderStatusId)">
                            Approve
                        </button>
                        <button type="button" class="btn btn-primary g1 my-2" @click="Complete(order.Id)">
                            Complete
                        </button>
                        <button type="button" class="btn btn-primary g1 my-2" @click="Cancel(order.Id)">
                            Cancel
                        </button>
                    </td>

                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    props: {
        orders: [],
        flag: Number
    },

    data() {
        return {
            orderItems: [],
            totalCost: [],

            statuses: [
                'Not Approved', 'Approved', 'Cancelled', 'Completed'
            ]         
        }
    },

    
    watch: { 
        flag: function() { 
            console.log('Tick');
            this.updateOrderItems();
            }
    },

    mounted() {
        this.updateOrderItems();
    },

    methods: {
        async updateOrderItems() {
            this.orderItems.splice(0, this.orderItems.length);
            this.orders.forEach(async order => {
                const response = await axios.get('http://localhost:3000/orders/' + order.Id + '/orderItems');
                this.orderItems.push([]);
                this.totalCost.push(0);
                for (const orderItem of response.data) {
                    let newOrderItem = {
                    Id: '',
                    OrderId: '',
                    ProductName: '',
                    Quantity: '',
                };
                    newOrderItem.Id = orderItem.Id;
                    newOrderItem.Quantity = orderItem.Quantity;
                    newOrderItem.OrderId = orderItem.OrderId; 

                    const prodResponse = await axios.get('http://localhost:3000/products/' + orderItem.ProductId);
                    newOrderItem.ProductName = prodResponse.data[0].Name;

                    this.totalCost[this.orders.indexOf(order)] += prodResponse.data[0].UnitPrice * orderItem.Quantity;

                    this.orderItems[this.orders.indexOf(order)].push(newOrderItem);
                }
                console.log('Jestem');
            });

            console.log(this.orderItems);
            
        },

        Approve(id, OrderStatusId) {
            if (OrderStatusId == 2) {
                alert('The order has already been approved');
                return;
            } 
            this.$emit('Approve', id);
        },

        Complete(id, OrderStatusId) {
            if (OrderStatusId == 4) {
                alert('The order has already been compeleted');
                return;
            } 
            this.$emit('Complete', id);
        },

        Cancel(id, OrderStatusId) {
            if (OrderStatusId == 3) {
                alert('The order has already been canceled');
                return;
            } 
            this.$emit('Complete', id);
        }
    },
}

</script>