import Router from "express";
import { getUser } from "../../../dal/user.dal";
import { getPromo } from "../../../dal/promo.dal";
import { getUserPromoByUser } from "../../../dal/userPromo.dal";
import UserPromos, { UserPromoSchema } from "../../../models/userPromos";
import logger from "../../../logger/logger";
import { UserPromoControlller } from "./userpromo.controller";
const router = Router();

router.post('/', UserPromoControlller.addPromo );

module.exports = router;
