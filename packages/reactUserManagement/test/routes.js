const express = require('express');
const router = express.Router();

const testData = require('./testData');
const userData = testData.user;
const roleData = testData.role;
router.get('/api/user-management/user', (req, res, next) => {
    res.set({
        'X-Total-Count': userData.length
    });
    return res.json(userData);
});
router.get('/api/user-management/user/current', (req, res, next) => {
    res.json({
        id: 3,
        name: "Onur Bird",
        username: "obird",
    });
});
router.get('/api/user-management/user/:id', (req, res, next) => {
    res.json({
        ...userData.filter(u => u.id == req.params.id)[0],
        roles: ['1','3'].map(i => roleData.filter(r => r.id == i)[0])
    });
});
router.post('/api/user-management/user', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/user/:id/change-email', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/user/:id/change-super-admin', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/user/:id/active', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/user/:id/reset-password', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/user/:id/confirmation', (req, res, next) => {
    res.json({
        message: "ok"
    });
});
router.post('/api/user-management/user/:id/role', (req, res, next) => {
    res.json({
        message: "ok"
    });
});

router.get('/api/user-management/role', (req, res, next) => {
    res.set({
        'X-Total-Count': roleData.length
    });
    return res.json(roleData);
});
module.exports = router;