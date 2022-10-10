const express = require('express');
const { create, list, houseByID, read, remove, update } = require('../controllers/house');

const router = express.Router();

router.param('houseId', houseByID);
router.post('/house', create);
router.get('/house', list);
router.get('/house/:houseId', read);
router.delete('/house/:houseId', remove);
router.put('/house/:houseId', update);


module.exports = router;