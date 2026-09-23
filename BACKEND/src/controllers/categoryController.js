const categoryModel = require('../models/categoryModel');

async function list(req, res, next) {
  try {
    res.json(await categoryModel.findAll());
  } catch (error) {
    next(error);
  }
}

module.exports = { list };
