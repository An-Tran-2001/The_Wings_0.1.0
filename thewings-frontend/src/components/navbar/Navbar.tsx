"use client"
import react from "react";
import Image from "next/image";

interface AppComponent {
    id: number,
    text: string,
    url: string,
}

const link: readonly AppComponent[] = [
    {
        id: 1,
        text: "LOGIN",
        url: "/dashboard/login",
    },
    {
        id: 2,
        text: "REGISTER",
        url: "/dashboard/register",
    },
]

const Navbar = () => {
    return(
            <div className= "w-full fixed top-0 flex items-center justify-center">
                <nav className="container items-center navbar navbar-expand-lg navbar-light bg-light flex justify-between my-10 p-5" >
                    <div>
                        <a className="navbar-brand" href="/">
                            <Image src="/logo.png" alt="thewings" width={100} height={100} />
                        </a>
                    </div>
                    <div className="flex space-x-5">
                        {link.map(link =>
                            <a className="navbar-brand" key={link.id} href={link.url}>{link.text}</a>
                        )}
                    </div>
                </nav>
            </div>
        )
}

export default Navbar

