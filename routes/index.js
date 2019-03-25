let router = require('express').Router();
let mongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017";

/* GET home page. */
router.get('/', function (req, res) {
    // 取得 IP
    let requestIP = (req.headers['x-forwarded-for'] || req.connection.remoteAddress ||
        req.socket.remoteAddress || req.connection.socket.remoteAddress).replace(/^.*:/, '');

    // 取得目前時間(timestamp)
    let currentTime = new Date().getTime() / 1000 | 0;

    //連線 Mongodb
    mongoClient.connect(url, {useNewUrlParser: true}, function (err, db) {
        if (err) throw err;
        let dbo = db.db("rate-limit");
        let requestInfo = {ip: requestIP, createTime: currentTime};

        // 取得請求次數
        dbo.collection("users").find({
            'ip': requestIP,
            "createTime": {"$gt": currentTime - 60}
        }).limit(61).count(true, function (err, result) {
            if (err) throw err;

            // 如果請求次數超過60次回傳Error
            if (result >= 60) {
                res.status(429).send('請求次數過多！');
                return;
            }

            // 新增請求紀錄
            dbo.collection("users").insertOne(requestInfo, function (err) {
                if (err) throw err;
                db.close();

                // 顯示 IP 與 請求次數
                res.render('index', {
                    title: 'rate-limit', ip: requestIP, count: result + 1
                });
            });
        });
    });
});

module.exports = router;