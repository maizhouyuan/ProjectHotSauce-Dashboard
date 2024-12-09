const express = require('express');
const router = express.Router();
const homepageRoutes = require('./homepage');
const sensorsRoutes = require('./sensors');
const reportsRoutes = require('./reports');

router.use('/homepage', homepageRoutes);
router.use('/sensors', sensorsRoutes);
router.use('/reports', reportsRoutes);

module.exports = router;