const express = require('express');
const router = express.Router();
const { GetAllProducts, GetProductById, AddProduct, EditProduct } = require('../Methods/Product');
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

router.get('/products', async (req, res) => {
  try {
    const data = await GetAllProducts(db);
    res.json(data);
    return;
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.get('/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const data = await GetProductById(db, id);
    res.json(data);
    return;
  } catch(err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.post('/products', async (req, res) => {
  try {
    const {name, description, unitPrice, unitWeight, categoryId} = req.body;
    
    if (!name || !description || !unitPrice || !unitWeight || !categoryId) {
      res.status(400).json({error: 'Too few arguments (Check that the arguments are not zero or empty)'});
      return;
    }

    if (checkParametres(name, description, unitPrice, unitWeight) != true) {
      res.status(400).json({error: checkParametres(name, description, unitPrice, unitWeight)});
      return;
    }

    const newProduct = await AddProduct(db, name, description, unitPrice, unitWeight, categoryId);
    res.status(200).json(newProduct);
    return;
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

router.put('/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const temp = GetProductById(db, id);
    if (!temp || temp.length === 0) {
      res.status(404).json({error: 'Product not found'});
      return;
    }

    const {name, description, unitPrice, unitWeight, categoryId} = req.body;
    if (!name && !description && !unitPrice && !unitWeight && !categoryId) {
      res.status(418).json({error: 'I\'m a teapot (All arguments are empty)'}); 
      return;
    }
    
    if (checkParametres(name, description, unitPrice, unitWeight) != true) {
      res.status(400).json({error: checkParametres(name, description, unitPrice, unitWeight)});
      return;
    }

    const updatedProduct = await EditProduct(db, id, {
      name, description, unitPrice, unitWeight, categoryId
    });
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function checkParametres(name, description, price, weight) {
  if (name) {
    if (name.length === 0) {
      return 'Name cannot be empty'; 
    }
  } 

  if (description) { 
    if (description.length === 0) {
      return 'Description cannot be empty';
    }
  } 

  if (price < 0 || price == 0) {
    return 'Price cannot be 0 or negative';
  } 

  if (weight < 0 || weight == 0) {
    return 'Weight cannot be 0 or negative';
  }

  return true;
}

module.exports = router;