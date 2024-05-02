import Imap from 'imap';
import { inspect } from 'util';
import { simpleParser, Source } from 'mailparser';
import logger from '../logger/logger';
import { handleBlabla } from './blabla';

export const imap = new Imap({
    user: 'pulkit0729@gmail.com',
    password: 'itnj odfu yscu qilr',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    keepalive: true,
});

imap.once('ready', function () {
    imap.openBox('INBOX', false, (err, _box) => {
        if (err) throw err;
        console.log("Inbox Connnected")
        imap.on('mail', function () {
            console.log("New Mail Arrived");
            console.log(_box.messages.total);

            var f = imap.seq.fetch(_box.messages.total + ':*', { bodies: '' });
            f.on('message', function (msg, _seqno) {
                msg.on('body', stream => {
                    simpleParser(stream as unknown as Source, async (error: any, parsed) => {
                        if (error) throw error;
                        let from = parsed.from?.value[0].address;
                        let subject = parsed.subject;
                        let message = parsed.html;
                        if (from?.includes("hello@blablacar.com") && subject && message) {
                            await handleBlabla(subject, message);
                        }

                    })
                });
                msg.once('end', function () {
                    console.log('Finished');
                });
            });
            f.once('error', function (err) {
                console.log('Fetch error: ' + err);
            });
            f.once('end', function () {
                console.log('Done fetching all messages!');
            });

        });
    });
});



imap.once('error', function (err: any) {
    logger.log({ level: "error", message: "Imap error: " + err });
    imap.connect();

});

imap.once('end', function () {
    console.log('Connection ended');
});

