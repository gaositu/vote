var ObjectID = require('mongodb').ObjectID;
var mongodb = require('./db');

function Vote (vote) {
    this.projName = vote.projName;
    this.projDesc = vote.projDesc;
    this.vtype = vote.vtype;
    this.ip = vote.ip;
    this.expDate = vote.expDate;
    this.projItems = vote.projItems;
    this.sponsor = vote.sponsor;
}

module.exports = Vote;

Vote.prototype.save = function (callback) {
    var vote = {
        projName: this.projName,
        projDesc: this.projDesc,
        vtype: this.vtype,
        ip: this.ip,
        expDate: this.expDate,
        projItems: this.projItems,
        sponsor: this.sponsor
    }
    
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        
        db.collection('votes', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            
            collection.insert(vote, {
                safe: true
            }, function (err, vote) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, vote[0]);
            });
        })
    });
}

Vote.findAll = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        
        db.collection('votes', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            
            collection.find().sort({_id: -1}).toArray(function (err, vList) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, vList);
            });
        })
    });
}

Vote.getOne = function (_id, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        
        db.collection('votes', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            
            collection.findOne({
                "_id": new ObjectID(_id)
            }, function (err, vote) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, vote);
            });
        });
    });
}

Vote.remove = function (_id, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        
        db.collection('votes', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
//            console.log('--' + _id);
            collection.remove({"_id": new ObjectID(_id)}, {}, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}

Vote.castVote = function (_id, projItems, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        
        db.collection('votes', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            
            collection.update({
                "_id": new ObjectID(_id)
            }, {
                $set: {projItems: projItems}
            }, function (err) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        });
    });
}

Vote.getFilledProjItems = function (_id, checkedItems, callback) {
    var vote = this.getOne(_id, function (err, vote) {
        var projItems = vote.projItems,
            i,
            len = projItems.length,
            j,
            len2;
        
        if (err) {
            // TODO
        }
        
        if (! checkedItems instanceof Array) {
            checkedItems = [].push(checkedItems);
        }
        
        len2 = checkedItems.length;
        
        for (i=0; i<len; i++) {
            for (j=0; j<len2; j++) {
                if (projItems[i]['item'] == checkedItems[j]) {
                    projItems[i]['voteIps'].push(1);
                }
            }
        }
        
        callback(null, projItems);
    });
}