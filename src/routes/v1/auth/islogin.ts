import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";

const userRouter = Router();

userRouter.get("/", authMiddle, async (req, res) => {
    const user = req.body.user;
    res.status(200).json({
        success: true,
        auth: true,
        user: {
            name: user.name,
            email: user.email,
            companyName: user.companyName,
            userId: user._id,
        },
    });
});

module.exports = userRouter;