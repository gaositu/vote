
/*
 * GET home page.
 */
var crypto = require('crypto'),
    Vote = require('../models/vote.js');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index', { title: '投票系统' });
    });
    
    app.post('/insert', function (req, res) {
        var projName = req.body.projName,
            projDesc = req.body.projDesc,
            vtype = req.body.vtype,
            ip = req.body.ip,
            expDate = req.body.expDate,
            projItems = req.body.projItems,
            sponsor = req.body.sponsor,
            items = projItems.split('||'),
            i,
            len = items.length,
            tmpObj,
            voteArr = [];
        
        for (i=0; i<len; i++) {
            tmpObj = {};
            tmpObj.item = items[i];
            tmpObj.voteIps = [];
            voteArr.push(tmpObj);
        }
        
//        console.log(req.body);
        
        var newVote = new Vote({
            projName: req.body.projName,
            projDesc: req.body.projDesc,
            vtype: req.body.vtype,
            ip: req.body.ip,
            expDate: req.body.expDate,
            projItems: voteArr,
            sponsor: req.body.sponsor
        });
        
        newVote.save(function (err, newVote){
            if (err) {
                console.log('err---------');
            }
            
            res.redirect('/list');
        });
    });
    
    app.get('/list', function (req, res) {
        Vote.findAll(function (err, vList) {  
            res.render('list', { title: '投票系统 - 项目列表', vList: vList });  
        }); 
    });
    
    app.get('/delVote/:id', function (req, res) {
        console.log( req.params.id );
        Vote.remove(req.params.id, function (err) {
            if (err) {
                console.log(err);
                return res.redirect('back');
            }
            res.redirect('/list');
        });
    });
    
    app.get('/vpage/:id/:pName', function(req, res) {
        Vote.getOne(req.params.id, function (err, vote) {
            if (err) {
                // TODO
            }
            
            res.render('vpage', {title: '投票系统 - 投票页', pName: req.params.pName, vote: vote, success: req.flash('success').toString()});
        });
    });
    
    app.get('/rpage/:id', function(req, res) {
        res.render('rpage', {title: '投票系统 - 查看结果'});
    });
    
    app.post('/castVote', function (req, res) {
        var id = req.body.id,
            checkedItems = req.body[id],
            projName = req.body.projName;
        
        Vote.getFilledProjItems(id, checkedItems, function (err, projItems) {
            Vote.castVote(id, projItems, function (err) {
                if (err) {
                    console.log(err);
    //                return res.redirect('back');
                }
                req.flash('success', '投票成功，谢谢参与！');
                res.redirect('/vpage/'+id+'/'+projName);
            });
        });
    });
};

/*
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};*/
