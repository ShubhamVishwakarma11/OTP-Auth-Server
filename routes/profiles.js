const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const { getProfile, createProfile } = require("../controllers/profileController");

const router = express.Router();
router.use(requireAuth);

router.get('/get', getProfile);

router.post('/create', createProfile);

module.exports = router;
