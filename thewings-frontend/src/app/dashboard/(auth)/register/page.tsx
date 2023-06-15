"use client"
import React from "react"
import { useState, useRef } from "react";
import Input,{validateUserName, validatePassword, validateEmail, validatePhone} from  "@/components/input/Input"
export default () => {
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    return(
        <div className = "w-full h-screen flex justify-center items-center">
            <form className="w-3/5 p-10 bg-gray-900">
                <div className="grid grid-cols-2 gap-2">
                    <Input label="Username" onChange={e => setUserName(e.target.value)} validated={validateUserName} value={userName}/>
                    <Input label="Name" onChange={e => setName(e.target.value)} value={name}/>
                    <Input label="Email" onChange={e => setEmail(e.target.value)} validated={validateEmail} value={email}/>
                    <Input label="Phone" onChange={e => setPhone(e.target.value)} validated={validatePhone} value={phone}/>
                    <Input label="Password" onChange={e => setPassword(e.target.value)} validated={validatePassword} value={password}/>
                    <Input label="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} validated={validatePassword} value={confirmPassword}/>
                </div>
                <div className="p-5 w-full flex flex-col items-center">
                    <div className="flex flex-row items-center">
                        <input type="checkbox" className="h-5 mx-2 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300"/>
                        <p> I agree to the terms and conditions</p>
                    </div>
                    <button type="submit" className="h-12 px-5 mt-5 text-white font-semibold hover:bg-black transition duration-300">Register</button>
                </div>
            </form>
        </div>
    )
}