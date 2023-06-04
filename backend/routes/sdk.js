const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
    let data = JSON.parse(req.body);
    console.log(data);
    res.status(200).json({ message: "Data received" });
});

module.exports = router;