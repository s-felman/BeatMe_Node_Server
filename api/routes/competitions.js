const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const checkAuth = require('../middlewares/checkAuth');

const {
    getAllCompetitions,
    createCompetition,
    getCompetition,
    updateCompetition,
    deleteCompetition
} = require('../controllers/compController');

router.get('/', getAllCompetitions);
router.get('/:competitionId', getCompetition);

router.post('/', upload.single('image') ,createCompetition);
router.patch('/:competitionId', checkAuth, updateCompetition);
router.delete('/:competitionId', checkAuth, deleteCompetition);


module.exports = router;
