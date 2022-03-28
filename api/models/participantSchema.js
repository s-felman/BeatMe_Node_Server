const mongoose = require('mongoose');

const participantSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {type: mongoose.Schema.Types.ObjectId,  ref: 'User'},
    competitionId:{type: mongoose.Schema.Types.ObjectId,  ref: 'Competiton'},
    score: { type: Number },
    typeProps:[]
});

module.exports = mongoose.model('Participant', participantSchema);