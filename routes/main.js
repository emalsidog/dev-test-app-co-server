const express = require("express");
const router = express.Router();

const mainController = require("../controllers/main");

router.get("/stats", mainController.getPeople);

router.get("/stats/:id(\\d+)/", mainController.getPersonStats);

module.exports = router;