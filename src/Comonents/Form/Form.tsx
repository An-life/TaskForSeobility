import React, {ChangeEvent, useEffect, useState} from 'react';

import {sendForm} from '../../api/sendForm';
import {FormResponseType} from './types';

import styles from './styles.module.scss';

export const Form = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [isValidName, setISValidName] = useState(true);
    const [notValidNameText, setNotValidNameText] = useState('');
    const [isValidEmail, setISValidEmail] = useState(true);
    const [isValidPhone, setISValidPhone] = useState(true);
    const [notValidPhoneText, setNotValidPhoneText] = useState('');
    const [notValidEmailText, setNotValidEmailText] = useState('');
    const [isValidMessage, setISValidMessage] = useState(true);
    const [notValidMessageText, setNotValidMessageText] = useState('');
    const [isNotValidForm, setIsNotValidForm] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [formResponse, setFormResponse] = useState<FormResponseType>({});

    const nameHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value.toUpperCase());
        let nameReg = /^([a-zA-Z]{3,30}) ([a-zA-Z]{3,30})$/;

        if (nameReg.test(name)) {
            setISValidName(true);
            setNotValidNameText('');
        } else {
            setISValidName(false);
            setNotValidNameText('Enter correct first and last name');
        }
    }

    const emailHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        let emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (emailReg.test(email)) {
            setISValidEmail(true);
            setNotValidEmailText('');
        } else {
            setISValidEmail(false);
            setNotValidEmailText('Enter correct email');
        }
    }

    const phoneNumberHandler = (e: ChangeEvent<HTMLInputElement>) => {
        const phoneReg = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
        if (phoneReg !== null) {
            e.target.value = !phoneReg[2] ? phoneReg[1] : '+7' + '(' + phoneReg[1] + ') ' + phoneReg[2] + (phoneReg[3] ? '-' + phoneReg[3] : '') + (phoneReg[4] ? '-' + phoneReg[4] : '');
            setPhoneNumber(e.target.value)
        }
        if (phoneNumber.length > 0 && phoneNumber.length < 17) {
            setISValidPhone(false);
            setNotValidPhoneText('Enter full phone number');
        } else {
            setISValidPhone(true);
            setNotValidPhoneText('');
        }
    }

    const messageHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value)
        if (message.length > 1 && message.length < 10) {
            setISValidMessage(false);
            setNotValidMessageText('The message must contain at least 10 characters');
        } else if (message.length > 300) {
            setISValidMessage(false);
            setNotValidMessageText('The message must contain no more than 300 characters')
        } else {
            setISValidMessage(true);
            setNotValidMessageText('');
        }
    }

    const formValidate = name && email && phoneNumber && date && message.length >= 10 && isValidName && isValidEmail && isValidPhone && isValidMessage;

    useEffect(() => {
        if (formValidate) {
            setIsNotValidForm(false);
        } else {
            setIsNotValidForm(true);
        }
    }, [name, email, phoneNumber, date, message])

    const submitHandler = () => {
        setIsLoading(false)
        sendForm({name, email, phoneNumber, date, message}).then(response => {
            setFormResponse(JSON.parse(response));
            setIsLoading(true);
        });
        if (formResponse.success) {
            setName('');
            setEmail('');
            setPhoneNumber('');
            setDate('');
            setMessage('');
            setIsNotValidForm(true);
        }
    };

    const inputOptions = [
        {
            title: 'First name and last name:',
            isValid: isValidName,
            value: name,
            placeholder: 'Enter your name...',
            onChange: nameHandler,
            notValidText: notValidNameText
        },
        {
            title: 'E-mail:',
            isValid: isValidEmail,
            value: email,
            placeholder: 'Enter e-mail...',
            onChange: emailHandler,
            notValidText: notValidEmailText
        },
        {
            title: 'Phone number:',
            isValid: isValidPhone,
            value: phoneNumber,
            placeholder: '+7(000)000-00-00',
            onChange: phoneNumberHandler,
            notValidText: notValidPhoneText
        },
    ];

    const desabledButton = isNotValidForm || !isLoading;

    return (<form className={styles.container}>
        {inputOptions.map(({title, isValid, value, placeholder, onChange, notValidText}, index) => {
            return (<div key={index}>
                    <label
                        className={styles.title}>{title}
                    </label>
                    <input className={isValid ? styles.input : styles.notValidInput} value={value}
                           placeholder={placeholder} onChange={onChange}/>
                    <div className={styles.validMessage}>{notValidText}</div>
                </div>
            )
        })}
        <label className={styles.title}>Date of birth:</label>
        <input type='date' className={styles.input} value={date} onChange={(e) => {
            setDate(e.target.value)
        }}/>
        <label className={styles.title}>Message:</label>
        <textarea className={isValidMessage ? styles.textarea : styles.notValidTextarea} value={message}
                  onChange={messageHandler} placeholder='Enter your message...'/>
        <div className={styles.validMessage}>{notValidMessageText}</div>
        <button type='submit' className={styles.button} disabled={desabledButton}
                onClick={submitHandler}>Submit
        </button>
        {formResponse && <div
            className={styles.responseText}>{formResponse.success ? formResponse.success.message : formResponse.error?.message}</div>}
    </form>)
}
