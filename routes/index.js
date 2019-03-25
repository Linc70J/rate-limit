var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    // 取得 IP
    var requestIP = (req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
        req.socket.remoteAddress || req.connection.socket.remoteAddress).replace(/^.*:/, '');

    // 取得目前時間
    var currentTime = new Date().getTime() / 1000 | 0;

    //連線mogodb
    mongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        var dbo = db.db("rate-limit");
        var requestInfo = {ip: requestIP, createTime: currentTime};

        // 取得請求次數
        dbo.collection("users").find({
            'ip': requestIP,
            "createTime": {"$gt": currentTime - 60}
        }).limit(61).count(true, function (err, result) {
            if (err) throw err;

            // 如果請求次數過多回傳Error
            if (result >= 60) {
                res.status(429).send('請求次數過多！');
                return;
            }

            // 新增一筆請求紀錄
            dbo.collection("users").insertOne(requestInfo, function (err) {
                if (err) throw err;
                db.close();

                // 顯示IP與請求次數
                res.render('index', {
                    title: 'rate-limit', ip: requestIP, count: result + 1
                });
            });
        });
    });
});

module.exports = router;