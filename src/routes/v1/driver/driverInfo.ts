import Router from "express";
import logger from "../../../logger/logger";
import driverAuthMiddle from "../../../middlewares/driverAuthMiddle";
import Driver from "../../../models/drivers";
import { getDriver } from "../../../dal/driver.dal";

const router = Router();

router.put("/", driverAuthMiddle, async (req, res) => {
  const driver = req.body.user;
  const userInfo = req.body.userInfo;
  try {
    if (userInfo === undefined || userInfo === null) throw new Error("Info missing");
    await Driver.updateOne({ email: driver.email }, { $set: { ...userInfo } });
    let newDriver = await getDriver(driver.id);
    return res.json({
      success: true,
      user: newDriver,
    });
  } catch (error: any) {
    logger.error(`Update userInfo API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    return res.send({ success: false, msg: "Unable to Update" });
  }
});

module.exports = router;
