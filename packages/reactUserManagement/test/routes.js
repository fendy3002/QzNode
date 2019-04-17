const express = require('express');
const router = express.Router();

const userData = require('./testData');
router.get('/api/user-management', (req, res, next) => {
    res.json(userData);
});
router.get('/api/user-management/:id', (req, res, next) => {
    res.json[{

    }];
});
router.post('/api/user-management', (req, res, next) => {
    res.json(userData.filter(k => k.id == req.params.id));
});
router.post('/api/user-management/:id/change-email', (req, res, next) => {
    
});

module.exports = router;