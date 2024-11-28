// controllers/urlController.js
const Url = require('../models/urlModel');

// Create a shortened URL
exports.createShortUrl = async (req, res, next) => {
  try {
    const { originalUrl } = req.body;
    const url = await Url.create({ originalUrl });
    res.status(201).json({
      id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
      visitCount: url.visitCount,
      createdAt: url.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

// Redirect to the original URL
exports.redirectToOriginalUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (url) {
      // Increment visit count
      url.visitCount += 1;
      await url.save();

      // Redirect to the original URL
      res.redirect(url.originalUrl);
    } else {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'No URL found for the provided short code.',
      });
    }
  } catch (err) {
    next(err);
  }
};

// Get URL statistics
exports.getUrlStatistics = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOne({ shortCode });

    if (url) {
      res.status(200).json({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
        visitCount: url.visitCount,
        createdAt: url.createdAt,
      });
    } else {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'No URL found for the provided short code.',
      });
    }
  } catch (err) {
    next(err);
  }
};

// Delete a shortened URL
exports.deleteShortUrl = async (req, res, next) => {
  try {
    const { shortCode } = req.params;
    const url = await Url.findOneAndDelete({ shortCode });

    if (url) {
      res.status(204).send();
    } else {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'No URL found for the provided short code.',
      });
    }
  } catch (err) {
    next(err);
  }
};

// List all URLs with pagination
exports.listAllUrls = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const totalItems = await Url.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);

    const urls = await Url.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: urls.map((url) => ({
        id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${req.protocol}://${req.get('host')}/${url.shortCode}`,
        visitCount: url.visitCount,
        createdAt: url.createdAt,
      })),
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (err) {
    next(err);
  }
};