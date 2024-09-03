import { Request, Response } from 'express';
import logger from '../../../logger/logger';
import { sendMessageToGroup } from '../../../services/external/telegram';
import { triggerWorkflow } from '../../../services/external/retool';

export default class TrackController {
  static async book(req: Request, res: Response) {
    try {
      await Promise.all([
        sendMessageToGroup('Book Request' + Object.values(req.body).join(' ')),
        triggerWorkflow(req.body),
      ]);
    } catch (error: any) {
      logger.error(error.message);
    }
    res.send(200);
  }
}
