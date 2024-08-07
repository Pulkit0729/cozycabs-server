import Router from "express";
import { issueJWT, verifyJWT } from "../../../utils/jwt.util";
import { genreferralCode, updateUserConfirm } from "../../../utils/user.util";
import { getUserFromPhone } from "../../../dal/user.dal";
import logger from "../../../logger/logger";
import { flowTypes } from "../../../utils/constants";
import { verifyOTP } from "../../../services/mcentral";


const router = Router();


router.post('/otp', async (req, res) => {
  const { otp, phone } = req.body;

  try {
    const formattedPhone = '91' + phone.trim();
    const user = await getUserFromPhone(formattedPhone);
    let flowType = flowTypes.login;
    if (!user || !user?.phoneVerificationId) throw new Error("Invalid phone or Otp");
    let isVerified = await verifyOTP(user.phoneVerificationId, parseInt(otp));
    if (!isVerified) throw new Error("Invalid phone or Otp");
    const token = issueJWT(user.id);
    let payload: any = {
      token,
      phone
    }
    if (!user.phoneConfirmed || !user.name) {
      user.phoneConfirmed = true;
      user.referralCode = genreferralCode();
      user.markModified('phoneConfirmed');
      user.markModified('referralCode');
      await user.save();
      flowType = flowTypes.createUser;
    } else {
      payload = { ...payload, user: user };
      flowType = flowTypes.login;
    }
    payload.flowType = flowType;
    return res.status(200).json({ success: true, data: payload });
  } catch (error: any) {
    logger.error(`OTP API, error: ${error.message}, phone: ${phone} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
    );
    return res.json({ success: false, message: error.message });
  }

})


router.get("/jwt/:token", async (req, res) => {
  const token = req.params.token;

  try {
    const verify: any = verifyJWT(token);
    const user = await updateUserConfirm(verify.sub);
    console.log(user);

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