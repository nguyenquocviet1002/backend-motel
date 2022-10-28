import express from 'express';
const router = express.Router();

import { read, update, checkIdUser } from '../controllers/user.controller';
import { requireSignin, isAdmin, isAuth } from '../controllers/auth.controller';

router.param('userId', checkIdUser);

router.get('/secret/:userId', requireSignin, isAuth, isAdmin, (req, res) => {
  res.json({
    user: req.profile,
  });
});

router.get('/user/:userId', read);
router.put('/user/:userId', requireSignin, update);

// router.param('userId', userById);

module.exports = router;
