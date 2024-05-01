import { parse } from 'node-html-parser';
import { book, cancel } from './handlers';
export async function handleBlabla(subject: string, message: string) {
    let name, babla_ride_id, seats, user_phone;
    // console.log(message);

    const root = parse(message);
    root.getElementsByTagName('a').forEach((element) => {
        if (element.hasAttribute('href') && element.getAttribute('href')?.includes('id=')) {
            let url = element.getAttribute('href');
            babla_ride_id = url?.split("id=")[1].slice(0, 36);
        }
    })
    root.getElementsByTagName('h1').forEach((element) => {

        name = element.innerHTML.replace('\n', "").trim().split(' ')[0];
    })

    switch (true) {
        case subject.includes("Passenger accepted for"):
            root.getElementsByTagName('a').forEach((element) => {
                if (element.hasAttribute('href') && element.getAttribute('href')?.includes('tel')) {
                    let url = element.getAttribute('href');
                    user_phone = '91' + url?.split(":")[1].replace("%2", "").slice(-10);
                }
            })
            root.getElementsByTagName('p').forEach((element) => {
                if (element.innerText.includes('seat')) {
                    seats = element.innerHTML.replace('\n', "").trim().split(' ')[0];
                };
            })
            await book(user_phone!, name!, seats, undefined, babla_ride_id);
            break;
        case subject.includes("New passenger for"):
            root.getElementsByTagName('a').forEach((element) => {
                if (element.hasAttribute('href') && element.getAttribute('href')?.includes('tel')) {
                    let url = element.getAttribute('href');
                    user_phone = url?.split(":")[1];
                }
            })
            root.getElementsByTagName('p').forEach((element) => {
                if (element.innerText.includes('seat')) {
                    seats = element.innerHTML.replace('\n', "").trim().split(' ')[0];
                };
            })
            await book(user_phone!, name!, seats, undefined, babla_ride_id);

            break;
        case subject.includes("Cancellation for"):
            await cancel(undefined, undefined, name, babla_ride_id);
            break;

        default:
            break;
    }
    console.log(name, babla_ride_id, seats, user_phone);

}