
import { getIdPass } from "../../../utils/decode.util";
import { createUser, sendVerifEmail} from "../../../utils/user.util"

import express from "express";

const userRouter = express.Router();


userRouter.post("/", async (req, res) => {
    const { email, password } = getIdPass(req.headers);
    const { firstName, LastName, phoneNumber } = req.body;
    try {
      if (!firstName ) {
        return res.json({ success: false, msg: "First Name Required" });
      }
      const user = await createUser(email, password, firstName, LastName, phoneNumber);
      await sendVerifEmail(user.id, user.email);
      // logger.log({
      //   level: "info",
      //   message: `SignUp API called, ip: ${IP.address()} userId: ${user.id} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
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


  module.exports = userRouter;