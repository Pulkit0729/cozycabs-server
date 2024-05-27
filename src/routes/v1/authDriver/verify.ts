import Router from "express";
import { issueJWT, verifyJWT } from "../../../utils/jwtUtils";
import { getDriverFromPhone } from "../../../dal/driver.dal";
import logger from "../../../logger/logger";
import { flowTypes } from "../../../utils/constants";
import { verifyOTP } from "../../../services/mcentral";


const router = Router();


router.post('/otp', async (req, res) => {
  const { otp, phone } = req.body;
  const formattedPhone = '91' + phone.trim();
  try {
    const driver = await getDriverFromPhone(formattedPhone);
    let flowType = flowTypes.login;
    if (!driver || !driver?.phoneVerificationId) throw new Error("Invalid phone or Otp");
    let isVerified = await verifyOTP(driver.phoneVerificationId, otp);
    if (!isVerified) throw new Error("Invalid phone or Otp");
    const token = issueJWT(driver.id);
    let payload: any = {
      token,
      phone
    }
    if (!driver.phoneConfirmed) {
      driver.markModified('phoneConfirmed');
      driver.phoneConfirmed = true;
      await driver.save();
      flowType = flowTypes.createUser;
    } else {
      payload = { ...payload, name: driver.name, email: driver.email };
      flowType = flowTypes.login;
    }
    payload.flowType = flowType;
    return res.status(200).json({ success: false, data: payload });
  } catch (error: any) {
    logger.error(`OTP API, error: ${error.message}, phone: ${phone} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    return res.json({ success: false, message: error.message });
  }

})


router.get("/:token", async (req, res) => {
  const token = req.params.token;

  try {
    const verify: any = verifyJWT(token);
    // const driver = await updateDriverConfirm(verify.sub);
    // console.log(driver);

    // logger.log({
    //   level: "info",
    //   message: `Verify Token API, ip: ${IP.address()} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    // });
    return res.redirect(`${process.env.SERVER_URL}`);
  } catch (error: any) {
    // logger.log({
    //   level: "error",
    //   message: `Verify Token API, ip: ${IP.address()} error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    // });
    return res.send("Url is invalid, PLease Try Again");
  }
});

module.exports = router;