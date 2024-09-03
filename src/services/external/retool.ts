import axios from 'axios';
import logger from '../../logger/logger';

const retoolWebhook =
  'https://api.retool.com/v1/workflows/f5d704ed-cec2-49b0-953d-74e935419617/startTrigger';

export interface IRetoolPostBody {
  phone: string;
  from?: string;
  to?: string;
  departure?: string;
}

export const triggerWorkflow = async (data: IRetoolPostBody) => {
  try {
    const res = await axios.post(
      retoolWebhook,
      {
        phone: data.phone,
        from: data.from,
        to: data.to,
        time: data.departure,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Workflow-Api-Key': 'retool_wk_20739d2b0f3145f1ae9bbfbaffe5349d',
        },
      }
    );
    return res.data;
  } catch (error: any) {
    logger.error(error.message);
    return;
  }
};
