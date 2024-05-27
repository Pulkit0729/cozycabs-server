
import { getIdPass } from "../../../utils/decodeUtils";

import express from "express";

const driverRouter = express.Router();


driverRouter.post("/", async (req, res) => {
    const { email, password } = getIdPass(req.headers);
    const { firstName, LastName, phoneNumber } = req.body;
    try {
      if (!firstName ) {
        return res.json({ success: false, msg: "First Name Required" });
      }
      // const driver = await createDriver(email, password, firstName, LastName, phoneNumber);
      // await sendVerifEmail(driver.id, driver.email);
      // logger.log({
      //   level: "info",
      //   message: `SignUp API called, ip: ${IP.address()} driverId: ${driver.id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      // });
      return res.json({ success: true, msg: "Account Created successfully"});
    } catch (error: any) {
      // logger.log({
      //   level: "error",
      //   message: `SignUp API called, ip: ${IP.address()} error: ${error.message} email: ${email} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
      // });
      return res.json({
        success: false,
        msg: error.message,
      });
    }
  });


  module.exports = driverRouter;