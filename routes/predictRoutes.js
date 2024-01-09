const { Router } = require('express');
const predictController = require('../controllers/predictController');

const router = Router();

router.post('/predict-contest', predictController.predictRating);
router.post('/fetch-predicted', predictController.fetchPredictedRating);

module.exports = router;
