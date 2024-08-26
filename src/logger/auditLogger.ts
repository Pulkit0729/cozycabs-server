import { createLogger, format, transports } from 'winston';
import path from 'path';
const { combine, timestamp, printf, json } = format;
require('dotenv').config();
import 'winston-mongodb';

const myFormat = printf((info) => {
  return `EventLog ${info.timestamp} ${info.level}: ${info.message}`;
});

function mylogger() {
  return createLogger({
    level: 'debug',
    transports: [
      new transports.File({
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
        filename: path.join(__dirname, '../../', 'logs/api/eventLogs.log'),
        maxsize: 102400,
      }),
      new transports.Console({
        format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), myFormat),
      }),
      //   new transports.MongoDB({
      //     level: 'debug',
      //     format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
      //     db: process.env.DB_STRING as string,
      //     options: {
      //       useUnifiedTopology: true,
      //       socketTimeoutMS: 0,
      //       connectTimeoutMS: 0,
      //     },
      //     metaKey: 'additionalInfo',
      //     collection: 'apiLogs',
      //   }),
    ],
  });
}
export default mylogger();
