const express = require('express');
const { create, list, findContractByID, read } = require('../controllers/contract.controller');

const router = express.Router();

router.param('idContract', findContractByID);

router.post('/contract', create);
router.get('/contract', list);
router.get('/contract/:idContract', read);


module.exports = router;