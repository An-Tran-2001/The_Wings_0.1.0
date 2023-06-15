import React from "react"

export default () => {
    return(
        <div className = "w-full h-screen flex justify-center items-center">
            <form className="w-3/5 p-10 bg-gray-900">
                <div className="grid grid-cols-2">
                    <div className="p-5">
                        <label className="text-white font-semibold ">Username</label>
                        <input type="text" className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300" />
                    </div>
                    <div className="p-5">
                        <label className="text-white font-semibold ">Name</label>
                        <input type="text" className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300" />
                    </div>
                    <div className="p-5">
                        <label className="text-white font-semibold ">Email</label>
                        <input type="text" className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300" />
                    </div>
                    <div className="p-5">
                        <label className="text-white font-semibold ">Phone Number</label>
                        <input type="text" className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300" />
                    </div>
                    <div className="p-5">
                        <label className="text-white font-semibold ">Password</label>
                        <input type="text" className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300" />
                    </div>
                    <div className="p-5">
                        <label className="text-white font-semibold ">Confirm Password</label>
                        <input type="text" className="w-full h-12 px-5 rounded-lg bg-gray-700 text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-300" />
                    </div>
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