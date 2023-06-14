import React from "react";
import Image from "next/image";


export default () => {
    return(
        <div className = "w-full h-screen flex justify-center items-center">
            <Image src={"/logo.png"} width={300} height={300} alt={"logo"} />
        </div>
    )
}