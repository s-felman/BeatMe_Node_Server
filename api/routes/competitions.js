const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const checkAuth = require('../middlewares/checkAuth');

const {
    getAllCompetitions,
    createCompetition,
    getCompetition,
    updateCompetition,
    deleteCompetition,
    getCompetitionByManager
} = require('../controllers/compController');

router.get('/', getAllCompetitions);
router.get('/:competitionId', getCompetition);
router.get('/getByManager/:managerId', getCompetitionByManager);
router.post('/', upload.single('image'), createCompetition);
router.patch('/:competitionId', updateCompetition);
router.delete('/:competitionId', deleteCompetition);


module.exports = router;
