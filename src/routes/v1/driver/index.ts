import Router from "express";
const router = Router();

router.use("/driverInfo", require("./driverInfo"));
router.use("/rideStatus", require("./rideStatus"));

module.exports = router;
