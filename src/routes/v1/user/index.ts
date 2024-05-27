import Router from "express";
const router = Router();

router.use("/userInfo", require("./userInfo"));

module.exports = router;
