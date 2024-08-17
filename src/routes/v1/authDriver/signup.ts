// import { getIdPass } from '../../../utils/decode.util';

// import express from 'express';

// const driverRouter = express.Router();

// driverRouter.post('/', async (req, res) => {
//   // const { email, password } = getIdPass(req.headers);
//   const { firstName } = req.body;
//   try {
//     if (!firstName) {
//       return res.json({ success: false, msg: 'First Name Required' });
//     }
//     // const driver = await createDriver(email, password, firstName, LastName, phonenumber);
//     // await sendVerifEmail(driver.driverId, driver.email);
//     // logger.log({
//     //   level: "info",
//     //   message: `SignUp API called, ip: ${IP.address()} driverId: ${driver.driverId} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
//     // });
//     return res.json({ success: true, msg: 'Account Created successfully' });
//   } catch (error: any) {
//     // logger.log({
//     //   level: "error",
//     //   message: `SignUp API called, ip: ${IP.address()} error: ${error.message} email: ${email} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
//     // });
//     return res.json({
//       success: false,
//       msg: error.message,
//     });
//   }
// });

// module.exports = driverRouter;
