const express = require('express');
const knex = require('knex');
const config = require('./knex');
//const cors = require('cors');

const ProductApi = require('./API/Product.js');
const CategoryApi = require('./API/Category.js');
const OrdersApi = require('./API/Order.js');
const OrderStatusApi = require('./API/OrderStatus.js')
const OrderItemApi = require('./API/OrderItem.js');


const app = express();
const port = process.env.PORT || 3000;
app.use(ProductApi);
app.use(CategoryApi);
app.use(OrdersApi);
app.use(OrderStatusApi);
app.use(OrderItemApi);


const db = knex(config);

app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello world');
});

app.listen(port, () => {
})