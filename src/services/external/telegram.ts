const axios = require('axios').create();
const telegramApiUrl =
  'https://api.telegram.org/bot7321908872:AAH61bZIOSzsIXy06ZqCnkvbnfOtFY7N21M';

async function makeRequest(
  url: string,
  method: any,
  body: ITelegramPostBody,
  headers: any
) {
  return axios[method]((url = url), body, { headers });
}

export interface ITelegramPostBody {
  chat_id: string;
  text: string;
}

export const sendMessageToGroup = async (message: string) => {
  await makeRequest(
    telegramApiUrl + '/sendMessage',
    'post',
    {
      chat_id: '-1002206591405',
      text: message,
    },
    { 'Content-Type': 'application/json' }
  );
};
