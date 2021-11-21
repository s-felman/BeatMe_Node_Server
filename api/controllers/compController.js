const { query } = require('express');
const mongoose = require('mongoose');
const Competition = require('../models/competitionSchema');
const Admin = require('../models/userSchema');

module.exports = {
    getAllCompetitions: (req, res) => {
        Competition.find().populate('adminId').then((competitions) => {
            res.status(200).json({
                competitions
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    createCompetition: (req, res) => {
        console.log("rew",req.body)
        // const { path: image } = req.file;
        const {compName, adminId,compType, details, target,targetDate, usersList, typeProps } = req.body.comp;
        console.log(adminId)
        Admin.findById(adminId).then((admin) => {
            if (!admin) {
                return res.status(404).json({
                    message: 'Administer not found'
                })
            }

            const competition = new Competition({
                _id: new mongoose.Types.ObjectId(),
                compName, 
                adminId,
                compType, 
                details, 
                target,
                targetDate, 
                usersList,
                //  image: image.replace('\\','/')
                typeProps
            });

            competition.save().then((compe) => {
            Competition.findById(compe._id).then((compe)=>{
                const comp=compe;
            res.status(200).json({
                message: 'Created competition',
                comp
            })
            }).catch(error => {
            res.status(500).json({
                error }) 
            }) 
        })
        });
    },
    getCompetition: (req, res) => {
        const competitionId = req.params.competitionId;

        Competition.findById(competitionId).then((competition) => {
            res.status(200).json({
                competition
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    updateCompetition: (req, res) => {
        const competitionId = req.params.competitionId;
        const { adminId } = req.body;

        Competition.findById(competitionId).then((competition) => {
            if (!competition) {
                return res.status(404).json({
                    message: 'Competition not found'
                })
            }
        }).then(() => {
            if (adminId) {
                return Admin.findById(adminId).then((admin) => {
                    if (!admin) {
                        return res.status(404).json({
                            message: 'Admin not found'
                        })
                    }

                    return Competition.updateOne({ _id: competitionId }, req.body);
                }).then(() => {
                    res.status(200).json({
                        message: 'Competition Updated'
                    })
                }).catch(error => {
                    res.status(500).json({
                        error
                    })
                });
            }

            Competition.updateOne({ _id: competitionId }, req.body).then(() => {
                res.status(200).json({
                    message: 'Competition Updated'
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })


    },
    deleteCompetition: (req, res) => {
        const competitionId = req.params.competitionId

        Competition.findById(competitionId).then((competition) => {
            if (!competition) {
                return res.status(404).json({
                    message: 'Competition not found'
                })
            }
        
            Competition.deleteOne({ _id: competitionId }).then(() => {
                res.status(200).json({
                    message: `Competition _id:${competitionId} Deleted`
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    },
    getCompetitionByManager:(req, res) => {

        const managerId = req.params.managerId;
        Competition.find({adminId: managerId}).then((competition) => {
            console.log(competition)
            res.status(200).json({
                competition
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    }
}