import { Types } from 'mongoose';
import { getUserPromo } from '../dal/userPromo.dal';
import { IBooking } from '../models/bookings';
import { IPromo, PromoSources, PromoTypes } from '../models/promos';
import UserPromo from '../models/userPromos';
import { IUser } from '../models/users';
import { getUser } from '../dal/user.dal';
import { searchPromo } from '../dal/promo.dal';
import { IRide } from '../models/rides';

export class UserPromoService {
  static async addPromoToUser(
    user: IUser,
    promo: IPromo,
    validDays: number,
    referalUser?: IUser
  ) {
    const validUptoDate = new Date();
    validUptoDate.setDate(validUptoDate.getDate() + validDays);
    const userPromo = new UserPromo({
      userId: user.userId.toString(),
      referredFrom: referalUser?.userId.toString() ?? '',
      promoId: promo.promoId,
      isUsed: false,
      validUpto: validUptoDate,
    });
    await userPromo.save();
    return userPromo;
  }

  static async handlePromoApplication(
    user: IUser,
    userPromoId: string,
    booking: IBooking
  ) {
    const userPromo = await this.validatePromo(
      user,
      userPromoId,
      booking.billDetails.discountItemTotal
    );
    userPromo.isUsed = true;

    const discount = this.calPromoDiscount(
      userPromo.promo,
      booking.billDetails.discountItemTotal
    );
    booking.promoId = new Types.ObjectId(userPromoId);
    booking.billDetails.promoDiscount = discount;
    booking.billDetails.grandTotal =
      booking.billDetails.discountItemTotal - discount;
    userPromo.markModified('isUsed');
    await userPromo.save();
  }

  static async validatePromo(
    user: IUser,
    userPromoId: string,
    discountedTotal: number
  ) {
    const userPromo = await getUserPromo(userPromoId);
    if (
      !userPromo ||
      userPromo.isUsed ||
      userPromo.userId.toString() != user.userId.toString()
    )
      throw new Error(`User do not have promo: ${userPromoId}`);
    if (userPromo.validUpto < new Date())
      throw new Error(`User Promo ${userPromoId} is expired`);
    if (userPromo.promo.minimumAmount > discountedTotal)
      throw new Error(`Promo ${userPromoId} minimun amount error`);
    return userPromo;
  }

  static calPromoDiscount(promo: IPromo, discountedTotal: number) {
    switch (promo.type) {
      case PromoTypes.FLAT:
        return promo.offAmount;
      case PromoTypes.PERCENTAGE:
        let discount = (discountedTotal * promo.percentage) / 100;
        discount =
          discount < promo.maximumDiscount! ? discount : promo.maximumDiscount;
        return discount;
      default:
        break;
    }
    return 0;
  }

  static async handleReferralPromoAfterRide(
    booking: Omit<
      Omit<
        IBooking & {
          _id: Types.ObjectId;
        },
        'ride'
      > & {
        ride: IRide;
      },
      'user'
    >
  ) {
    if (booking.promoId) {
      const userPromo = await getUserPromo(booking.promoId.toString());
      if (!userPromo || !userPromo.referredFrom) return;
      const referralFromUser = await getUser(userPromo.referredFrom);
      if (!referralFromUser) return;
      const promo = await searchPromo({
        name: process.env.REFERRAL_REWARD_COUPON ?? 'REFERAL50',
        source: PromoSources.AUTOMATIC,
      });
      if (!promo) return;
      await UserPromoService.addPromoToUser(referralFromUser, promo, 365);
    }
  }
}
