import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
    name: String,
    phone: {
        type: String,
        unique: true,
    },
    templateRide: String,
    exactPickup: String,
    exactDrop: String,
    exactPickupTime: String,
    noOfRides: Number,
    allowedCancels: Number,
    cancels: Number,
    offDays: [String],
    validUpto: Date
});

const Subscription = mongoose.model('Subscriptions', SubscriptionSchema, 'subscriptions');
export default Subscription;