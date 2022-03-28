const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

const {
    getParticipant,
    update,
    getParticipantsByComp
} = require('../controllers/participantController');

router.get('/getcompetitions/:compId', getParticipantsByComp)
router.get('/:userId/:competitionId',getParticipant)
router.patch('/update',update)

module.exports = router;