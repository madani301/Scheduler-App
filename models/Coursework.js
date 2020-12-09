const { emptyDir } = require('fs-extra')
const mongoose = require('mongoose')
const shortid = require('shortid')

const CourseworkSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  cwTitle: {
    type: String,
    required: true,
    trim: true,
  },
  modName: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: false,
  },
  modLevel: {
    type: String,
    default: 'Level 1',
    enum: ['Level 1', 'Level 2', 'Level 3', 'Level 4'],
  },
  milestones: {
    type: [String],
    required: true,
    default: null
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  targetDeadline: {
    type: Date,
    default: Date.now
  },
  actualDeadline: {
    type: Date,
    default: Date.now
  },
  cwStatus: {
    type: String,
    default: 'Active',
    enum: ['Active', 'Completed'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

module.exports = mongoose.model('Coursework', CourseworkSchema)
