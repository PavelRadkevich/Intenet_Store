const express = require('express');
const router = express.Router();
const { GetAllOrders, GetOrderById, AddOrder, EditOrder, GetOrderByStatus, GetOrderOrderItems } = require('../Methods/Order');
const knex = require('knex');
const config = require('../knex');
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

router.get('/orders', async (req, res) => {
    try {
      const data = await GetAllOrders(db);
      res.json(data);
      return;
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

router.get('/order/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await GetOrderById(db, id);
    res.json(data);
    return;
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

  router.post('/orders', async (req, res) => {
    try {
      const {approvalDate, orderStatusId, userName, email, phoneNumber} = req.body;
      if (!orderStatusId || !userName || !email || !phoneNumber) {
        res.status(400).json({error: 'Too few arguments  (Check that the arguments are not zero or empty)'});
        return;
      }

      if (!(typeof(userName) === 'string' && userName.match(/^[a-z]+$/i))) {
        res.status(400).json({error: 'Username can only contain letters'});
        return;
      }

      if (!email.includes("@")) {
        res.status(400).json({error: 'Invalid email (Correct example: \'aji@gmail.com\''});
        return;
      }

      const pattern = /^[0-9\s+]+$/;
      if(!pattern.test(phoneNumber)) {
        res.status(400).json({error: 'Invalid phone number (Correct example: \'+48 111 111 111\''});
        return;
      }

      const newOrder = await AddOrder(db, approvalDate, orderStatusId, userName, email, phoneNumber);
      //const jnewOrder = JSON.stringify(newOrder);
      res.status(200).json(newOrder);
      return;
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  router.patch('/orders/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const temp = GetOrderById(db, id);
      if (!temp || temp.length === 0) {
        res.status(404).json({error: 'Order not found'});
        return;
      }

      const patchOperations = req.body;
      const updatedOrder = await EditOrder(db, id, patchOperations);

      if (typeof(updatedOrder) === 'string') {
        res.status(400).json({error: updatedOrder});
        return;
      }

      res.status(200).json(updatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/orders/status/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const data = await GetOrderByStatus(db, id);
      res.json(data);
      return;
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

  router.get('/orders/:id/orderItems', async (req, res) => {
    const id = req.params.id;
    try {
      const data = await GetOrderOrderItems(db, id);
      res.json(data);
      return;
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })
module.exports = router;