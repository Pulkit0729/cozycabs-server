import { NextFunction, Request, Response } from "express";
import { getPromo } from "../../../dal/promo.dal";
import { getUser } from "../../../dal/user.dal";
import { getUserPromoByUser, getValidUserPromoByUser } from "../../../dal/userPromo.dal";
import UserPromos from "../../../models/userPromos";
import logger from "../../../logger/logger";
import { IUser } from "../../../models/users";
import { IPromo } from "../../../models/promos";

export class UserPromoControlller {
    static async addPromo(req: Request,
        res: Response) {
        const { userId, promoId, validDays } = req.body;
        try {
            const promo = await getPromo(promoId);
            if (!promo) throw new Error('Promo not found');
            const user = await getUser(userId);
            if (!user) throw new Error('Promo not found');
            const userPromo = await this.addPromoToUser(user, promo, validDays);
            return res.status(200).json({ success: true, message: "Promo Updated", promo: userPromo });

        } catch (error: any) {
            logger.error(`Promo Update API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
            );
            return res.send({ success: false, message: "Unable to update Promo" });
        }

    }

    static async addPromoToUser(user: IUser, promo: IPromo, validDays: number) {
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + validDays);


        let userPromo = await getUserPromoByUser(user.id as string);
        if (!userPromo) {
            let newUserPromos = new UserPromos({
                userId: user.id,
                promos: [
                    {
                        ...JSON.parse(JSON.stringify(promo)),
                        validUpto: currentDate,
                        createdDate: new Date()
                    }
                ]

            });
            await newUserPromos.save();
            userPromo = newUserPromos;
        } else {
            let userPromos = userPromo.promos;

            userPromos.push({
                ...JSON.parse(JSON.stringify(promo)),
                validUpto: currentDate,
                createdDate: new Date()
            });
            userPromo.set('promos', userPromos);
            userPromo.markModified('promos');
            await userPromo.save();
        }
        return userPromo;
    }

    static async getUserPromos(req: Request, res: Response) {
        const { user } = req.body;
        try {
            const userPromo = await getValidUserPromoByUser(user.id);
            return res.status(200).json({ success: true, data: userPromo[0] });

        } catch (error: any) {
            logger.error(`Promo API, error: ${error.message} URL: ${req.protocol}://${req.get('host')}${req.originalUrl}`
            );
            return res.send({ success: false, message: "Unable to fetch Promo" });
        }

    }
}