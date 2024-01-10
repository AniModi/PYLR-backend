const { Router } = require('express');
const frontendRequestController = require('../controllers/frontendRequestController');

const router = Router();

router.get('/contests/number-of-users/:contestID', frontendRequestController.getMaxPages);
router.get('/contests/:contestID/:page', frontendRequestController.fetchRanking);
router.post('/contests/get-predicted-ratings', frontendRequestController.fetchPredictedRating);


module.exports = router;
