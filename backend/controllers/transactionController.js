const axios = require('axios');
// const Transaction = require('../models/transactionModel');
const Transaction = require("../models/transactionModel");

// Seed database from third-party API
exports.seedDatabase = async (req, res) => {
  try {
    const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    await Transaction.insertMany(response.data);
    res.json({ message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding database', error });
  }
};

// List all transactions with search and pagination
exports.listTransactions = async (req, res) => {
  const { search, page = 1, perPage = 10 } = req.query;
  const searchQuery = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: Number(search) }
        ]
      }
    : {};
  
  try {
    const transactions = await Transaction.find(searchQuery)
      .skip((page - 1) * perPage)
      .limit(Number(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transactions', error });
  }
};

// Statistics for a selected month
exports.getStatistics = async (req, res) => {
  const month = req.params.month;

  try {
    const soldItems = await Transaction.find({
      sold: true,
      dateOfSale: { $regex: `-${month}-` }
    });
    const notSoldItems = await Transaction.find({
      sold: false,
      dateOfSale: { $regex: `-${month}-` }
    });
    const totalAmount = soldItems.reduce((acc, item) => acc + item.price, 0);

    res.json({
      totalSaleAmount: totalAmount,
      totalSoldItems: soldItems.length,
      totalNotSoldItems: notSoldItems.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error });
  }
};

// Bar chart data (price range)
exports.getPriceRange = async (req, res) => {
  const month = req.params.month;
  try {
    const items = await Transaction.find({ dateOfSale: { $regex: `-${month}-` } });
    const priceRanges = {
      '0-100': 0, '101-200': 0, '201-300': 0, '301-400': 0,
      '401-500': 0, '501-600': 0, '601-700': 0, '701-800': 0,
      '801-900': 0, '901+': 0
    };
    items.forEach(item => {
      if (item.price <= 100) priceRanges['0-100']++;
      else if (item.price <= 200) priceRanges['101-200']++;
      // Repeat for other ranges...
      else priceRanges['901+']++;
    });
    res.json(priceRanges);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching price ranges', error });
  }
};

// Pie chart data (categories)
exports.getCategories = async (req, res) => {
  const month = req.params.month;
  try {
    const items = await Transaction.find({ dateOfSale: { $regex: `-${month}-` } });
    const categoryCount = {};
    items.forEach(item => {
      if (!categoryCount[item.category]) categoryCount[item.category] = 0;
      categoryCount[item.category]++;
    });
    res.json(categoryCount);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

// Combined data API
exports.getCombinedData = async (req, res) => {
  const month = req.params.month;

  try {
    const [statistics, priceRange, categories] = await Promise.all([
      axios.get(`/statistics/${month}`),
      axios.get(`/price-range/${month}`),
      axios.get(`/categories/${month}`)
    ]);

    res.json({
      statistics: statistics.data,
      priceRange: priceRange.data,
      categories: categories.data
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching combined data', error });
  }
};

const getTransactions = async (req, res) => {
  try {
    const { search, page = 1, perPage = 10, month } = req.query;

    // Filter by month
    const monthIndex = new Date(Date.parse(month + " 1, 2024")).getMonth() + 1;
    const dateRegex = new RegExp(`^\\d{4}-${monthIndex < 10 ? "0" + monthIndex : monthIndex}-`);

    // Create search query
    let query = {
      dateOfSale: { $regex: dateRegex }
    };

    if (search) {
      query["$or"] = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { price: { $regex: search, $options: "i" } }
      ];
    }

    const totalItems = await Transaction.countDocuments(query);
    const transactions = await Transaction.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json({
      transactions,
      totalPages: Math.ceil(totalItems / perPage),
    });
  } catch (error) {
    console.error("Error fetching transactions", error);
    res.status(500).json({ message: "Server error" });
  }
};