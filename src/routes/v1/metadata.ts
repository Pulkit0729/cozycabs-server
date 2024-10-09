import { Router } from 'express';
import { getUniqueFromToPlaces } from '../../dal/templateRide.dal';

const router = Router();
router.get('/', async (_req, res) => {
  const { from, to } = await getUniqueFromToPlaces();
  return res.status(200).json({ success: true, data: { from: from, to: to } });
});

router.get('/app', async (_req, res) => {
  const whatsappNo = process.env.WHATSAPP_NO || '91';
  const whatsappNoPartner = process.env.WHATSAPP_NO_PARTNER || '91';
  const contactLink = `https://wa.me/${whatsappNo}?text=Support&type=phone_number`;
  const contactLinkPartner = `https://wa.me/${whatsappNoPartner}?text=Support&type=phone_number`;
  const showRideRequest = true;
  const rideRequestUrl = 'https://forms.gle/AnPAYCWCdeFhjhAN8';
  return res.status(200).json({
    success: true,
    data: { contactLink, contactLinkPartner, showRideRequest, rideRequestUrl },
  });
});

module.exports = router;
