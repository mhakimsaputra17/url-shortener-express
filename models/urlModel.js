// models/urlModel.js
const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid URL format.',
    },
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    default: () => nanoid(6),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  visitCount: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Url', urlSchema);