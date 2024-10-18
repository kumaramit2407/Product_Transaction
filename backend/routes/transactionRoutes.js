const express = require('express');
const {
  seedDatabase, listTransactions, getStatistics,
  getPriceRange, getCategories, getCombinedData
} = require('../controllers/transactionController');

const router = express.Router();

router.get('/seed', seedDatabase);
router.get('/transactions', listTransactions);
router.get('/statistics/:month', getStatistics);
router.get('/price-range/:month', getPriceRange);
router.get('/categories/:month', getCategories);
router.get('/combined/:month', getCombinedData);
router.get("/transactions", getTransactions);

module.exports = router;
