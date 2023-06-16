"use client"
import Input,{validateEmail, validatePassword, validateCode} from '@/components/input/Input'
import React from 'react'
import { useState } from 'react'

const page = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            const res = await axios.post('/api/auth/login', {
                email,
                password,
                code
            })
            localStorage.setItem('token', res.data.token)
            window.location.href = '/'
        } catch (err) {
            setError(err.response.data.error)
        }
        setLoading(false)
    }
  return (
    <div className = "w-full h-screen flex justify-center items-center">
        <div className="3xl flex flex-col items-center justify-center p-10 bg-gray-900">
            <h1 className="text-3xl text-white font-serif font-light tracking-wide">FORGOT PASSWORD</h1>
                <div className="flex flex-col w-full mt-5">
                    <Input label="Email" onChange={e => setEmail(e.target.value)} validated={validateEmail} value={email}/>
                    <Input label="Code" onChange={e => setCode(e.target.value)} validated={validateCode} value={code}/>
                    <Input label="Password" onChange={e => setPassword(e.target.value)} validated={validatePassword} value={password}/>
                    <Input label="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} validated={validatePassword} value={confirmPassword}/>
                </div>
            <p className="text-red-500">{error}</p>
            <button className="mt-5 hover:bg-black text-white font-bold py-2 px-4    focus:outline-none focus:shadow-outline" onClick={handleSubmit}>
                {loading? 'Loading...' : 'Submit'}
            </button>
            <p className="text-white text-center my-5">Don't have an account? <a href="dashboard/register">Register</a></p>
        </div>
    </div>
  )
}

export default page
