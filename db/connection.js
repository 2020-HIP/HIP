
const MongoClient = require('mongodb').MongoClient;
var database;

// useUnifiedTopology: true;

const getConn = (callback) => {
  // 데이터베이스 연결 정보
  var databaseUrl = 'mongodb+srv://hip0225:hip0225@cluster0.ssjlg.mongodb.net/hip?retryWrites=true&w=majority';
  // 데이터베이스 연결
  MongoClient.connect(databaseUrl, (err, db) => {
    console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
    callback(err, db);
    //database = db.db('local'); 필수

    db.close();
  });
};

module.exports = getConn;