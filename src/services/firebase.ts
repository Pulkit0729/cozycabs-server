import admin from 'firebase-admin';
import { getMessaging, Message } from 'firebase-admin/messaging';
import firebaseConfig from '../config/firebase.json';
import logger from '../logger/logger';


admin.initializeApp({
    credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount)
});

export const sendNotification = async (notification: Message) => {
    try {
        const res = await getMessaging().send(notification);
        logger.info('Successfully sent message:', res);
    } catch (error) {
        logger.error('Error sending message:', error);
    }
}