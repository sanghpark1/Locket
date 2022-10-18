const express = require('express');
const router = express.Router();

router.get("/api", (req, res) => {
    res.json('Hello from Solo')
});

module.exports = router;