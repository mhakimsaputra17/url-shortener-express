// routes/urlRoutes.js
const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { validateUrlCreation } = require('../validations/urlValidation');

router.post('/urls', validateUrlCreation, urlController.createShortUrl);
router.get('/urls', urlController.listAllUrls);
router.get('/urls/:shortCode', urlController.getUrlStatistics);
router.delete('/urls/:shortCode', urlController.deleteShortUrl);

module.exports = router;