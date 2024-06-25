import Router from "express";
import driverAuthMiddle from "../../../middlewares/driverAuthMiddle";

const userRouter = Router();

userRouter.get("/", driverAuthMiddle, async (req, res) => {
    const user = req.body.user;
    res.status(200).json({
        success: true,
        auth: true,
        user: user,
    });
});

module.exports = userRouter;