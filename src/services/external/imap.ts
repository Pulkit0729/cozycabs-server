import Imap from 'imap';
import { simpleParser, Source } from 'mailparser';
import logger from '../../logger/logger';
import BlablaService from './blabla';

const email = process.env.EMAIL!;
const password = process.env.PASSWORD!;
const host = process.env.IMAP_HOST!;

export const imap = new Imap({
  user: email,
  password: password,
  host: host,
  port: 993,
  tls: true,
  tlsOptions: { rejectUnauthorized: false },
  keepalive: true,
});

export default function connectToMailbox() {
  imap.removeAllListeners();
  imap.on('ready', function () {
    logger.log({
      level: 'info',
      message: 'Connection was made Successfuly, inside ready block',
    });
    imap.openBox('INBOX', false, (err, _box) => {
      if (err) throw err;
      logger.log({ level: 'info', message: 'Inbox Connnected' });
      imap.on('mail', function () {
        logger.log({
          level: 'info',
          message: 'New Mail Arrived Total: ' + _box.messages.total,
        });
        var f = imap.seq.fetch(_box.messages.total + ':*', { bodies: '' });
        f.on('message', function (msg, _seqno) {
          logger.log({ level: 'info', message: 'Seq message ' });
          msg.once('body', (stream) => {
            simpleParser(
              stream as unknown as Source,
              async (error: any, parsed) => {
                if (error) throw error;
                const from = parsed.from?.value[0].address;
                const subject = parsed.subject;
                const message = parsed.html;
                if (
                  from?.includes('hello@blablacar.com') &&
                  subject &&
                  message
                ) {
                  await BlablaService.handleBlabla(subject, message);
                }
              }
            );
          });
          msg.once('end', function () {
            logger.log({ level: 'info', message: 'Finished Message' });
          });
        });
        f.once('error', function (err) {
          logger.error('Fetch error: ' + err);
        });
        f.once('end', function () {
          f.removeAllListeners();
          logger.log({ level: 'info', message: 'Done fetching all messages!' });
        });
      });
    });
  });

  imap.on('error', function (err: any) {
    logger.log({ level: 'error', message: 'Imap error: ' + err });
    connectToMailbox();
  });

  imap.on('end', function () {
    logger.log({ level: 'info', message: 'Connection ended' });
    connectToMailbox();
  });

  imap.connect();
}
