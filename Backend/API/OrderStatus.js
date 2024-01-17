const express = require('express');
const router = express.Router();
const { GetAllOrderStatus } = require('../Methods/OrderStatus');
const knex = require('knex');
const config = require('../knex');
const db = knex(config);
const cors = require('cors');

const corsOptions8080 = {
  origin: 'http://localhost:8080',
  methods: 'GET',
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

router.get('/status', async (req, res) => {
    try {
      const data = await GetAllOrderStatus(db);
      res.json(data);
      return;
    } catch(err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  })

module.exports = router;