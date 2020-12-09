const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Coursework = require('../models/Coursework')

// @desc    Login/Landing page
// @route   GET /
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  })
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const courseworks = await Coursework.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      courseworks,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Dashboard
// @route   GET /dashboard
router.get('/active', ensureAuth, async (req, res) => {
  try {
    const courseworks = await Coursework.find({ user: req.user.id, cwStatus: 'Active'}).lean()
    res.render('active', {
      name: req.user.firstName,
      courseworks,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports = router
