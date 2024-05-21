import Router from "express";
import { verifyJWT } from "../../../utils/jwtUtils";
import { updateUserConfirm } from "../../../utils/userUtils";
// import logger from "../../../logger";
// import IP from 'ip';


const router = Router();

router.get("/:token", async (req, res) => {
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