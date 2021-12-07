const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const checkAuth = require('../middlewares/checkAuth');

const {
    getAllCompetitions,
    createCompetition,
    createVotesCompetition,
    getCompetition,
    updateCompetition,
    deleteCompetition,
    getCompetitionByManager,
    getCompetitionByParticipant
} = require('../controllers/compController');

router.get('/', getAllCompetitions);
router.get('/:competitionId', getCompetition);
router.get('/getByManager/:managerId', getCompetitionByManager);
router.post('/getByParticipant', getCompetitionByParticipant)
router.post('/', upload.single("myFile"), createCompetition);
router.post('/createvotes',upload.single("myFile"), createVotesCompetition);
router.patch('/:competitionId', updateCompetition);
router.delete('/:competitionId', deleteCompetition);


module.exports = router;
