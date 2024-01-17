const express = require('express');
const router = express.Router();
const { AddOrderItem, GetOrderItemById, EditOrderItem } = require('../Methods/OrderItem')
const knex = require('knex');
const config = require('../knex');
const { GetProductById } = require('../Methods/Product');
const { GetOrderById } = require('../Methods/Order');
const db = knex(config);
const cors = require('cors');

const corsOptions8080 = {
  origin: 'http://localhost:8080',
  methods: 'GET, POST',
  credentials: true,
  optionsSuccessStatus: 204,
};

const corsOptions3030 = {
  origin: 'http://localhost:3030',
  methods: 'GET, PUT, PATCH',
  credentials: true,
  optionsSuccessStatus: 204,
};

const customCors = (req, res, next) => {
  const allowedOrigins = ['http://localhost:3030', 'http://localhost:8080'];

  const origin = req.get('origin');

  if (allowedOrigins.includes(origin)) {
    if (origin === 'http://localhost:3030') {
      cors(corsOptions3030)(req, res, next);
    } else if (origin === 'http://localhost:8080') {
      cors(corsOptions8080)(req, res, next);
    }
  } else {
    res.status(403).json({ error: 'Not allowed by CORS' });
  }
};

router.use(customCors);

router.use(express.json());

router.get('/orderItem/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await GetOrderItemById(db, id);
    res.json(data);
    return;
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/orderItem', async (req, res) => {
    try {
      const {orderId, productId, quantity} = req.body;
      
      if (!orderId || !productId || !quantity) {
        res.status(400).json({error: 'Too few arguments (Check that the arguments are not zero or empty)'});
        return;
      }

      const product = await GetProductById(db, productId);
      if (!product || product.length == 0) {
        res.status(400).json({error: 'Product not found i database'});
        return;
      }

      const order = await GetOrderById(db, orderId);
      if (!order || order.length == 0) {
        res.status(400).json({error: 'Order not found i database'});
        return;
      }

      if (quantity == 0 || quantity < 0) {
        res.status(400).json({error: 'You cannot add an item with a negative or zero quantity'});
        return;
      }

      const newOrderItem = await AddOrderItem(db, orderId, productId, quantity);
      res.status(200).json(newOrderItem);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  router.put('/orderItem/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const {orderId, productId, quantity} = req.body;
      if (!orderId && !productId && !quantity) {
        res.status(400).json({error: 'There cannot be 0 arguments'});
        return;
      }

      const updatedOrderItem = await EditOrderItem(db, id, orderId, productId, quantity);

      if (typeof(updatedOrderItem) === 'string') {
        res.status(400).json({error: updatedOrderItem});
        return;
      }

      res.status(200).json(updatedOrderItem);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

module.exports = router;