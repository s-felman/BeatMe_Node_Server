// const { query } = require('express');
// const mongoose = require('mongoose');
// // const { path } = require('../../app');
// const Competition = require('../models/competitionSchema');
// const User = require('../models/userSchema');
const Participant = require('../models/participantSchema')
module.exports = {
    getParticipant: (req, res) => {
        const userId = req.params.userId;
        const competitionId = req.params.competitionId
        Participant.findOne({ userId: userId, competitionId: competitionId }).populate('userId').then((participant) => {
            res.status(200).json({
                participant
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    update: (req, res) => {

        const { userId, competitionId, typeProps, score } = req.body;

        Participant.findOne({ userId: userId, competitionId: competitionId }).then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: 'User not found'
                })
            }
            user.typeProps = typeProps;
            user.score = score

            Participant.updateOne({ _id: user._id }, user).then(() => {
                res.status(200).json({
                    message: 'Participant Updated',
                    id: user.userId
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    },
    getParticipantsByComp: (req, res) => {

        const compId = req.params.compId;
        Participant.find({ competitionId: compId }).populate('userId').then((competitions) => {
            res.status(200).json({
                competitions
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },




}