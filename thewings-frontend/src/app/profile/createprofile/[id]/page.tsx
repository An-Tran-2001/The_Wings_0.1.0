import React from 'react'
import Image from 'next/image'

const page = () => {
  return (
    <div className = "w-full h-screen flex justify-center items-center">
      <form className="w-1/2">
      <h1 className="text-3xl text-white font-serif font-light tracking-wide">CREATE PROFILE</h1>
        <div className="3xl flex flex-col items-center justify-centers bg-gray-900">
            <div className="flex flex-col w-full h-72">

            </div>
            <div className="flex flex-col w-full p-10">
                <div className="flex flex-col w-full mt-5">
                    <label className="text-white font-semibold">Name</label>
                    <input className="h-12 px-5 py-2 bg-gray-800 rounded-lg focus:outline-none focus:shadow-outline" type="text" placeholder="Name"/>
                </div>
            </div>
        </div>
      </form>
    </div>
  )
}

export default page
