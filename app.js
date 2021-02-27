// Dependencies 
const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config({ path: "./config/config.env" });

// Variables
const app = express();
const PORT = process.env.PORT;

const dbFilePath = path.join(__dirname, "database", "database.db");
const dbFileExists = fs.existsSync(dbFilePath);

const pathToJson = path.join(__dirname, "json");
const files = {
  users: `${pathToJson}/users.json`,
  usersStatistic: `${pathToJson}/users_statistic.json`,
};

// App uses
app.use(cors());

// Chech JSON files
require("./database/checkJsonFiles")(files);

// If db file does not exists => create new database file
if(!dbFileExists) {
  console.log("DB file does not exist. (Creating a new one...)");
  fs.openSync(dbFilePath, 'w');
}

// Database connection
let db = new sqlite3.Database(dbFilePath, (err) => {
  if (err) return console.error(err);
  console.log(`Connected`);
});

// If db file does not exists => call databaseConfig to create tables and write data into them
if (!dbFileExists) {
  require("./database/databaseConfig")(files, db);
}

// Global variable 
app.set("db", db);

// Routes
app.use("/", require("./routes/main"));

// Server startup
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${process.env.PORT}`);
});