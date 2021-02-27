const fs = require("fs");
const util = require("util");

const dbConfig = (files, db) => {
  const userStatsJson = fs.readFileSync(files.usersStatistic);
  const usersJson = fs.readFileSync(files.users);

  db.run = util.promisify(db.run);

  db.serialize(async () => {
    let userStats = JSON.parse(userStatsJson.toString());
    let users = JSON.parse(usersJson.toString());

    await db.run("CREATE TABLE IF NOT EXISTS users (id INT NOT NULL PRIMARY KEY, name TEXT, last_name TEXT, email TEXT, gender TEXT, ip_address TEXT)");
    console.log("'users' table has been created.");
    await db.run("CREATE TABLE IF NOT EXISTS users_statistics (date DATE, page_views INT, clicks INT, user_id INT, FOREIGN KEY (user_id) REFERENCES users(id))");
    console.log("'users_statistics' table has been created.");

    let stmt = db.prepare("INSERT INTO users_statistics VALUES(?, ?, ?, ?)");
    for (let item of userStats) {
      stmt.run(item.date, item.page_views, item.clicks, item.user_id);
    }
    stmt.finalize();

    stmt = db.prepare("INSERT INTO users VALUES(?, ?, ?, ?, ?, ?)");
    for (let item of users) {
      stmt.run(
        item.id,
        item.first_name,
        item.last_name,
        item.email,
        item.gender,
        item.ip_address
      );  
    }
    stmt.finalize();
  });
};

module.exports = dbConfig;
