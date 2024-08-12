import Router from 'express';
import authMiddle from '../../../middlewares/authMiddle';

const userRouter = Router();

userRouter.get('/', authMiddle, async (req, res) => {
  const user = req.body.user;
  res.status(200).json({
    success: true,
    auth: true,
    user,
  });
});

module.exports = userRouter;
