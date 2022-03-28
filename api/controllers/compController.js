
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
    getAllCompetitionsById: (req, res) => {
        const email = req.params.userList.email;
        Competition.find({ email }).populate('adminId').then((competitions) => {
            if (competition === null) {
                return res.status(401).json({
                    message: 'competition not  found'
                });
            }
            return res.status(200).json({
                competitions
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    createCompetition: (req, res) => {
        if (req.file !== undefined) {
            var { path: image } = req.file;
        }
        else
            image = "upload/static/default.jpg"
        const { compName, adminId, compType, details, target, targetDate } = req.body;
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
                image: image.replace('\\', '/'),
                typeProps
            });
            competition.save().then((compe) => {
                Competition.findById(compe._id).then((compe) => {
                    const comp = compe;
                    console.log("created comp", comp)
                    return res.status(200).json({
                        comp
                    })
                }).catch(error => {
                    return res.status(500).json({
                        error
                    })
                })
            })
        });
    },
    createVotesCompetition: (req, res) => {
        if (req.file !== undefined) {
            var { path: image } = req.file;
        }
        else
            image = "upload/static/default.jpg"
        const { compId, itemName, itemDetails } = req.body;

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
                image: image.replace('\\', '/'),
                score: 0,
            };

            comp.typeProps = [...comp.typeProps, item]
            return Competition.updateOne({ _id: compId }, comp).then(() => {
                Competition.findById(compId).then((com) => {
                    return res.status(200).json({
                        message: 'Competition itemsList updated ',
                        com
                    })
                })
            })
        })
            .catch(error => {
                return res.status(500).json({
                    error
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
        if (req.file !== undefined) {
            var { path: image } = req.file;
        }
        else
            image = "upload/static/default.jpg"
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
                    Competition.findById(competitionId).then((comp) => {
                        return res.status(200).json({
                            message: 'Competition itemsList updated ',
                            comp
                        })
                    })
                }).catch(error => {
                    res.status(500).json({
                        error
                    })
                });
            }
        })
    },
    updateVotesCompetition: (req, res) => {

        if (req.file !== undefined) {
            var { path: image } = req.file;
        }
        else
            image = "upload\\static\\default.jpg"
        const competitionId = req.params.competitionId;
        const { adminId, details, } = req.body;
        var comp
        Competition.findById(competitionId).then((competition) => {
            if (!competition) {
                return res.status(404).json({
                    message: 'Competition not found'
                })
            }
            comp = competition
        }).then(() => {
            if (adminId) {
                return Admin.findById(adminId).then((admin) => {
                    if (!admin) {
                        return res.status(404).json({
                            message: 'Admin not found'
                        })
                    }
                    comp.details = details;
                    comp.image = image.replace('\\', '/')
                    return Competition.updateOne({ _id: competitionId }, comp);
                }).then(() => {
                    Competition.findById(competitionId).then((comp) => {
                        return res.status(200).json({
                            message: 'Competition itemsList updated ',
                            comp
                        })
                    })
                }).catch(error => {
                    res.status(500).json({
                        error
                    })
                });
            }
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
    getCompetitionByManager: (req, res) => {

        const managerId = req.params.managerId;
        Competition.find({ adminId: managerId }).then((competition) => {
            res.status(200).json({
                competition
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    getCompetitionByParticipant: (req, res) => {
        // const userId = req.params.userId;
        var comps = []
        const compList = req.body.compList

        Competition.find().populate('adminId').then((competition) => {

            for (var j = 0; j < compList.length;) {
                for (var i = 0; i < competition.length;) {
                    if (competition[i].id === (compList[j])) {
                        comps.push(competition[i])
                        break
                    }
                    else
                        i++;
                }
                j++;
            };

            return res.status(200).json({
                message: 'users competition',
                comps
            })
        }).catch(error => {
            res.status(500).json({
                error
            })
        });
    },
    // getCompetitionByParticipant:(req, res) => {
    //     const participantId = req.body.participantId;
    //     const competitionId= req.body.competitionId;
    //     const userEmail= req.body.userEmail;

    //     Competition.findById(competitionId).then((competition) => {
    //         competition.usersList.forEach(i => {
    //             if(i.userEmail===userEmail){
    //                 Admin.findById(participantId).then((user)=>{
    //                     user.competitionsList=[...user.competitionsList, competitionId]
    //                     Admin.updateOne({ _id: participantId },user).then(()=>{
    //                          res.status(200).json({
    //                         competition
    //                         }) 
    //                     }) 
    //                 })
    //         }
    //     })           
    //     }).catch(error => {
    //         res.status(500).json({
    //             error
    //         })
    //     });
    // } //check when the user want to change the email and validate it
    addScoreVotes: (req, res) => {
        const { competitionId, itemId, score } = req.body;
        Competition.findById(competitionId).then((comp) => {
            if (!comp) {
                return res.status(404).json({
                    message: 'Competition not found'
                })
            }
            for (var i = 0; i < comp.typeProps.length; i++) {
                if (comp.typeProps[i]._id.equals(itemId))
                    comp.typeProps[i].score = comp.typeProps[i].score + score;
            }
            Competition.updateOne({ _id: competitionId }, comp).then(() => {
                res.status(200).json({
                    message: 'item score Updated'
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    },
    
    addWinner: (req, res) => {
        const { compId, winnerId } = req.body;
        Competition.findById(compId).then((comp) => {
            if (!comp) {
                return res.status(404).json({
                    message: 'Competition not found'
                })
            }
            comp.winner = winnerId;
            Competition.updateOne({ _id: compId }, comp).then(() => {
                res.status(200).json({
                    message: 'winner Updated'
                })
            }).catch(error => {
                res.status(500).json({
                    error
                })
            });
        })
    },
}