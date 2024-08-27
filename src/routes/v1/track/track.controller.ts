import { Request, Response } from 'express';
import logger from '../../../logger/logger';
import { sendMessageToGroup } from '../../../services/external/telegram';

export default class TrackController {
  static async book(req: Request, res: Response) {
    try {
      await sendMessageToGroup(JSON.stringify(req.body));
    } catch (error: any) {
      logger.error(error.message);
    }
    res.send(200);
  }
}
