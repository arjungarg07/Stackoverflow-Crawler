const mysql = require('mysql2');
const { mysqlDbConfig } = require('./config');
const pool = mysql.createPool(mysqlDbConfig);
function commonQuery(query,params) {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (!err) {
        connection.query(query,params, function (err, results) {
          connection.release();
          if (!err) {
            resolve(results);
          } else {
            reject(err);
          };
        })
      } else {
        console.log("Nothing to do ", err);
        reject(err);
      }
    })
  })
};

module.exports = { commonQuery };