import Router from "express";
import { getUser } from "../../../dal/user.dal";
import { getPromo } from "../../../dal/promo.dal";
import { getUserPromoByUser } from "../../../dal/userPromo.dal";
import UserPromos, { UserPromoSchema } from "../../../models/userPromos";
import logger from "../../../logger/logger";
const router = Router();

router.post('/', async (req, res) => {
    const { userId, promoId, validDays } = req.body;
    try {
        const promo = await getPromo(promoId);
        if (!promo) throw new Error('Promo not found');
        const user = await getUser(userId);
        if (!user) throw new Error('Promo not found');

        let userPromo = await getUserPromoByUser(userId);
        if (!userPromo) {
            let newUserPromos = new UserPromos({
                userId: userId,
                promos: [
                    {
                        ...JSON.parse(JSON.stringify(promo)),
                        valid_upto: validDays,
                        created_date: new Date()
                    }
                ]

            });
            await newUserPromos.save();
            userPromo = newUserPromos;
        } else {
            let userPromos = userPromo.promos;
             
            userPromos.push({
                ...JSON.parse(JSON.stringify(promo)),
                valid_upto: validDays,
                created_date: new Date()
            });
            userPromo.set('promos', userPromos );
            userPromo.markModified('promos');
            await userPromo.save();
        }
        return res.status(200).json({ success: true, message: "Promo Updated", promo: userPromo });

    } catch (error: any) {
        logger.error(`Promo Update API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
        );
        return res.send({ success: false, message: "Unable to update Promo" });
    }

})

module.exports = router;
