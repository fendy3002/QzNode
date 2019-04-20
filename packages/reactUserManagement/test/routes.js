const express = require('express');
const router = express.Router();

const userData = require('./testData');
router.get('/api/user-management', (req, res, next) => {
    res.set({
        'X-Total-Count': userData.length
    });
    return res.json(userData);
});
router.get('/api/user-management/current', (req, res, next) => {
    res.json({
        id: 3,
        name: "Onur Bird",
        username: "obird",
    });
});
router.get('/api/user-management/:id', (req, res, next) => {
    res.json([{

    }]);
});
router.put('/api/user-management', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/:id/change-email', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/:id/change-super-admin', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/:id/active', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/:id/reset-password', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/:id/confirmation', (req, res, next) => {
    res.json({
        message: "ok"
    });
});

module.exports = router;