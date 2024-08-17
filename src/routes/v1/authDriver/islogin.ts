import Router from 'express';
import driverAuthMiddle from '../../../middlewares/driverAuthMiddle';

const userRouter = Router();

userRouter.get('/', driverAuthMiddle, async (req, res) => {
  const driver = req.body.driver;
  res.status(200).json({
    success: true,
    auth: true,
    driver: driver,
  });
});

module.exports = userRouter;
