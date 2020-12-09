const express = require('express')
const shortId = require('shortid')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const path = require('path')
const Coursework = require('../models/Coursework')

// @desc    Show add page
// @route   GET /courseworks/add
router.get('/add', ensureAuth, (req, res) => {
  res.render('courseworks/add')
})

// @desc    Process add form
// @route   POST /courseworks
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id
    await Coursework.create(req.body)
    res.redirect('/dashboard')
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show all courseworks
// @route   GET /courseworks
router.get('/', ensureAuth, async (req, res) => {
  try {
    const courseworks = await Coursework.find()
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean()

    res.render('courseworks/index', {
      courseworks,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

// @desc    Show single coursework
// @route   GET /courseworks/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let coursework = await Coursework.findById(req.params.id).populate('user').lean()

    if (!coursework) {
      return res.render('error/404')
    }

    if (coursework.user._id != req.user.id) {
      res.render('error/404')
    } else {
      res.render('courseworks/show', {
        coursework,
      })
    }
  } catch (err) {
    console.error(err)
    res.render('error/404')
  }
})

// @desc    Show edit page
// @route   GET /courseworks/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
  try {
    const coursework = await Coursework.findOne({
      _id: req.params.id,
    }).lean()

    if (!coursework) {
      return res.render('error/404')
    }

    if (coursework.user != req.user.id) {
      res.redirect('/courseworks')
    } else {
      res.render('courseworks/edit', {
        coursework,
      })
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Update coursework
// @route   PUT /courseworks/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let coursework = await Coursework.findById(req.params.id).lean()

    if (!coursework) {
      return res.render('error/404')
    }

    if (coursework.user != req.user.id) {
      res.redirect('/courseworks')
    } else {
      coursework = await Coursework.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      })

      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

// @desc    Delete coursework
// @route   DELETE /courseworks/:id
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let coursework = await Coursework.findById(req.params.id).lean()

    if (!coursework) {
      return res.render('error/404')
    }

    if (coursework.user != req.user.id) {
      res.redirect('/courseworks')
    } else {
      await Coursework.remove({ _id: req.params.id })
      res.redirect('/dashboard')
    }
  } catch (err) {
    console.error(err)
    return res.render('error/500')
  }
})

module.exports = router
