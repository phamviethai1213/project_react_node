const express = require('express');
const router = express.Router();

// utils
const JwtUtil = require('../utils/JwtUtil');

// daos
const AdminDAO = require('../models/AdminDAO');
const CategoryDAO = require ('../models/CategoryDAO') ;

// login
router.post('/login', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    try {
      const admin = await AdminDAO.selectByUsernameAndPassword(
        username,
        password
      );

      if (admin) {
        const token = JwtUtil.genToken(username, password);
        res.json({
          success: true,
          message: 'Authentication successful',
          token: token
        });
      } else {
        res.json({
          success: false,
          message: 'Incorrect username or password'
        });
      }
    } catch (err) {
      console.error('Error during admin login:', err);
      res.status(500).json({
        success: false,
        message: 'Server error while accessing database'
      });
    }
  } else {
    res.json({
      success: false,
      message: 'Please input username and password'
    });
  }
});

router.get('/token', JwtUtil.checkToken, function (req, res) {
  const token =
    req.headers['x-access-token'] || req.headers['authorization'];

  res.json({
    success: true,
    message: 'Token is valid',
    token: token
  });
});

// category
router.get('/categories', JwtUtil.checkToken, async function (req, res) {
  try {
    const categories = await CategoryDAO.selectAll();
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, message: 'Server error fetching categories' });
  }
});

// get one category by id (protected)
router.get('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  try {
    const category = await CategoryDAO.selectById(_id);
    if (category) {
      return res.json({ success: true, data: category });
    } else {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error fetching category by id:', err);
    return res.status(500).json({ success: false, message: 'Server error fetching category' });
  }
});

// create category (protected)
router.post('/categories', JwtUtil.checkToken, async function (req, res) {
  const name = req.body && req.body.name ? req.body.name.trim() : '';
  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    const category = { name: name };
    const result = await CategoryDAO.insert(category);
    // return created resource (or DAO result)
    return res.status(201).json({ success: true, data: result });
  } catch (err) {
    console.error('Error creating category:', err);
    return res.status(500).json({ success: false, message: 'Server error creating category' });
  }
});

// update category (protected)
router.put('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  const name = req.body && req.body.name ? req.body.name.trim() : '';

  if (!name) {
    return res.status(400).json({ success: false, message: 'Category name is required' });
  }

  try {
    const category = { _id: _id, name: name };
    const result = await CategoryDAO.update(category);
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error updating category:', err);
    return res.status(500).json({ success: false, message: 'Server error updating category' });
  }
});

router.delete('/categories/:id', JwtUtil.checkToken, async function (req, res) {
  const _id = req.params.id;
  try {
    const result = await CategoryDAO.delete(_id);
    if (result) {
      return res.json({ success: true, data: result });
    } else {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (err) {
    console.error('Error deleting category:', err);
    return res.status(500).json({ success: false, message: 'Server error deleting category' });
  }
});


module.exports = router;