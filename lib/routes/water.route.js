const express = require('express');

const router = express.Router();

router.post('/water/update:waterId');
router.delete('/water/remove/:waterId');
router.delete('/water/deleteAll/:roomId');
router.get('/water/:roomId');

module.exports = router;
