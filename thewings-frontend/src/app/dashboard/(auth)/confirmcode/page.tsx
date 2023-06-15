"use client"
import React from "react"
import { useState } from "react"
import Input,{validateCode} from "@/components/input/Input"

export default () => {
    const [code, setCode] = useState("");
    return(
        <div className = "w-full h-screen flex justify-center items-center">
            <div className="3xl flex flex-col items-center justify-center p-10 bg-gray-900">
                <h1 className="text-3xl text-white font-serif font-light tracking-wide">CONFIRM CODE</h1>
                <form className="p-4">
                    <Input label="Code" onChange={e => setCode(e.target.value)} validated={validateCode} value={code}/>
                    <div className="w-full flex flex-col items-center mt-5">
                        <button type="submit" className="mx-auto h-12 px-5 text-white font-semibold hover:bg-black transition duration-300">NEXT</button>
                    </div>
                </form>
            </div>
        </div>
    )
}