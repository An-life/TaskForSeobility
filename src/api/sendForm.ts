import {SendFormDataType} from './types';

export async function sendForm({name, email, phoneNumber, date, message}: SendFormDataType) {
    try {
        const formResponse = await fetch('/ajax', {
            method: 'POST', body: JSON.stringify({
                name, email, phoneNumber, date, message
            }), headers: {'content-type': 'application/json'}
        });

        return formResponse.json();
    } catch (error) {
        console.log(error);
    }
    return null;
}
