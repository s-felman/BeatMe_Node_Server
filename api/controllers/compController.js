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
        console.log(req.body)
        if(req.file !== undefined){
            var { path: image } = req.file;}
        else
         image ="upload\\1633339585502-(Reka.us)A_Dreamy_World_75th_by_grafixeye.jpg"
    //     if(req.file!==undefined){
    //     image = req.file.path;
    // }
    //console.log(image)
        const {compName, adminId,compType, details, target,targetDate } = req.body;
        const typeProps = JSON.parse(req.body.typeProps)
        const usersList = JSON.parse(req.body.usersList)

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
                image: image.replace('\\','/'),
                typeProps
            });

            competition.save().then((compe) => {
            Competition.findById(compe._id).then((compe)=>{
                const comp=compe;
                console.log("ךך", comp)
            return res.status(200).json({
                // message: 'Created competition',
                comp
            })
            }).catch(error => {
            return res.status(500).json({
                error }) 
            }) 
        })
        });
    },
    createVotesCompetition: (req, res) => {
        console.log(req.body,req.file)
        
        const { path: image } = req.file;
        const {compId ,itemName, itemDetails } = req.body;

        Competition.findById(compId).then((comp) => {
            if (!comp) {
                return res.status(404).json({
                    message: 'Competition not found'
                })
            }

            const item = {
                _id: new mongoose.Types.ObjectId(),
                itemName: itemName,
                itemDetails: itemDetails,
                image: image.replace('\\','/'),
            };

            comp.typeProps=[...typeProps, item]

            Competition.updateOne({_id: compId}, comp).then((compe)=>{
            res.status(200).json({
                message: 'Competition itemsList updated ',
                comp
            })
            }).catch(error => {
            res.status(500).json({
                error }) 
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
        }).then( () => {
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
            res.status(200).json({
                competition
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    getCompetitionByParticipant:(req, res) => {
        console.log(req.body)
        const participantId = req.body.participantId;
        const competitionId= req.body.competitionId;
        const userEmail= req.body.userEmail;
        Competition.findById(competitionId).then((competition) => {
            const usersList= competition.usersList;
            usersList.forEach(i => {
                if(i.userEmail===userEmail){
                    Admin.findById(participantId).then((users)=>{
                        const user=users
                        user.competitionsList=[...user.competitionsList, competitionId]

                        Admin.updateOne({ _id: participantId },user).then(()=>{
                             res.status(200).json({
                            competition
                            }) 
                        }) 
                    })
            }
        })           
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    }

    }