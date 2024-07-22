import Router from "express";
import authMiddle from "../../../middlewares/authMiddle";
import logger from "../../../logger/logger";
import User from "../../../models/users";
import { getUser } from "../../../dal/user.dal";

const router = Router();

router.put("/", authMiddle, async (req, res) => {
  const user = req.body.user;
  const userInfo = req.body.userInfo;
  try {
    if (userInfo === undefined || userInfo === null) throw new Error("Info missing");
    await User.updateOne({ _id: user.id }, { $set: { ...userInfo } });
    let newUser = await getUser(user.id);
    return res.json({
      success: true,
      user: newUser,
    });
  } catch (error: any) {
    logger.error(`Update userInfo API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    return res.send({ success: false, msg: "Unable to Update" });
  }
});

module.exports = router;
