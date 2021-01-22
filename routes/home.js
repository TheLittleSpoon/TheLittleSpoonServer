// Express
const express = require('express');

const router = express.Router();

router.get('/', (req,res) => {
    res.send('Welcome to the little spoon server');
});

module.exports = router;