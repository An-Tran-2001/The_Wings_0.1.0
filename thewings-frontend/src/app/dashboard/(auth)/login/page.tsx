"use client"
import React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import Input,{validateUserName, validatePassword} from  "@/components/input/Input"

export default () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    
    const forcusInput = () => {
        inputRef.current?.focus();
    }
    return(
        <div className = "w-full h-screen flex justify-center items-center">
            <div className="flex flex-row w-4/5  justify-between items-center">
                <div className="w-1/2 flex flex-col items-center">
                    <Image src={"/logo.png"} width={400} height={400} alt={"logo"} />
                </div>
                <form className="w-1/2 max-w-xl h-1/2 flex flex-col items-center bg-gray-900 p-10 ">
                    <div className="flex flex-col w-full mt-5">
                        <Input label="Username" onChange={e => setUsername(e.target.value)} validated={validateUserName} value={username} onKeyDown={e => e.key === 'Enter' && forcusInput()}/>
                    </div>
                    <div className="flex flex-col w-full mt-5">
                        <Input label="Password" onChange={e => setPassword(e.target.value)} validated={validatePassword} value={password} ref={inputRef}/>
                    </div>
                    <button type="submit" className="h-12 px-5 mt-5 text-white font-semibold hover:bg-black transition duration-300">Login</button>
                </form>
            </div>
        </div>
    )
}