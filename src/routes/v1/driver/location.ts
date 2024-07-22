import { Router } from "express";
import Driver, { IDriver } from "../../../models/drivers";
import { Document } from "mongoose";
import driverAuthMiddle from "../../../middlewares/driverAuthMiddle";
import { ILocation } from "../../../models/templatedRides";
import { Types } from "mongoose";
import logger from "../../../logger/logger";

const router = Router();
router.post("/", driverAuthMiddle, async (req, res) => {
    const { user, location }: {
        user: Document<unknown, {}, IDriver> & IDriver & {
            _id: Types.ObjectId;
        }, location: any[]
    } = req.body;
    try {
        user.currentLocation = {
            type: 'Point',
            coordinates: location
        } as ILocation;
        user.markModified('currentLocation');
        await user.save();
        return res.status(200).json({ success: true, message: "Driver Location Updated successfully" });
    } catch (error: any) {
        logger.error(`Driver Location API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        return res.send({ success: false, msg: "Unable to update Driver location" });
    }
});

module.exports = router;