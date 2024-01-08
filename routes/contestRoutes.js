const { Router } = require('express');
const contestController = require('../controllers/contestController');

const router = Router();

router.post('/contest', contestController.fetchContestData);
router.post('/merge', contestController.mergeContestData);

module.exports = router;
