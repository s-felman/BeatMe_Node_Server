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
    updateVotesCompetition,
    deleteCompetition,
    getCompetitionByManager,
    getCompetitionByParticipant,
    addScoreVotes,
    addWinner
} = require('../controllers/compController');

router.get('/', getAllCompetitions);
router.get('/getcompetition/:competitionId', getCompetition);
router.get('/getByManager/:managerId', getCompetitionByManager);
router.post('/getByParticipant', getCompetitionByParticipant)
router.post('/', upload.single("myFile"), createCompetition);
router.post('/createvotes',upload.single("myFile"), createVotesCompetition);
router.patch('/:competitionId',upload.single("myFile"), updateCompetition);
router.patch('/votes/:competitionId',upload.single("myFile"), updateVotesCompetition);
router.post('/addscore', addScoreVotes)
router.delete('/:competitionId', deleteCompetition);
router.post('/addwinner', addWinner);

module.exports = router;
