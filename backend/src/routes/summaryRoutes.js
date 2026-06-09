const express = require("express");

const {
 getSummary
} = require("../controllers/applicationController");

const router = express.Router();


router.get("/summary", getSummary);

module.exports = router;