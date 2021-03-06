const mongoose = require('mongoose');

const compSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    compName:{type: String, require: true},
    adminId:{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    compType: {type: String, require: true},
    details:{ type: String},
    target: {type: String, require: true},
    targetDate: {type: Date, require: true},
    usersList:[],
    answersList:{type: Map},
    image: { type: String },
    typeProps:[],
    winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

module.exports = mongoose.model('Competiton', compSchema);