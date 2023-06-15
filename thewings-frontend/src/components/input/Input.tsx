import React from "react"
import {forwardRef} from 'react';

const pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,}$/;
const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const validateUserName = (value: string): string => {
  return value.length > 0 && value.length < 8 ? 'Username requires more than 8 characters' : '';
};

const validatePassword = (value: string): string => {
  return value.length > 0 && (value.length < 8 || !pattern.test(value))
    ? 'Password requires more than 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character'
    : '';
};

const validateEmail = (value: string): string => {
  return value.length > 0 && !validRegex.test(value) ? 'Email is invalid' : '';
};

const validatePhone = (value: string): string => {
  return value.length > 0 && value.length <= 10 ? 'Phone requires more than 10 numbers' : '';
};

const validateCode = (value: string): string => {
  return value.length > 0 && (value.length < 6 || value.length > 6) ? 'Code requires 6 numbers' : '';
};

interface InputProps {
    label: string,
    validated? (value: string): string,
    onChange? (event: React.ChangeEvent<HTMLInputElement>): void,
    onKeyDown? (event: React.KeyboardEvent<HTMLInputElement>): void,
    value?: string,
}

const Input = forwardRef<HTMLInputElement, InputProps>(({label, validated, onChange, onKeyDown, value}, ref) => {
    return (
        <div className="relative">
            <label className="text-white font-semibold ">{label}</label>
            <input onChange={onChange} onKeyDown={onKeyDown} ref={ref} className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300"/>
            <span className="absolute text-xs r-0 w-40 bg-gray-600 mx-3 z-10">{validated && validated(value || '')}</span>
        </div>
    );
});


export default Input; 
export {validateUserName, validatePassword, validateEmail, validatePhone, validateCode};