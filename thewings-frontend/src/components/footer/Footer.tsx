import React from 'react'

interface AppComponent {
    id: number,
    text: string,
    url: string,
}

const link: readonly AppComponent[] = [
    {
        id: 1,
        text: "Read Docs",
        url: "/dashboard/login",
    },
    {
        id: 1,
        text: "Services",
        url: "/dashboard/login",
    },
    {
        id: 1,
        text: "Rules",
        url: "/dashboard/login",
    },
    {
        id: 1,
        text: "Relationships",
        url: "/dashboard/login",
    },
]

const Footer = () => {
  return (
    <div>
        <footer className="fixed bottom-0 w-full">
            <div className = "container grid mx-auto grid-cols-4 content-center text-center font-mono font-light text-2xl p-5">
                {link.map(link =>
                <a key={link.id} href={link.url} className="text-white hover:text-gray-500">
                    {link.text}
                </a>
                )}
            </div>
          <p className="right-0 bottom-0 text-xs font-sans">Copyright &copy; 2023</p>
        </footer>
    </div>
  )
}

export default Footer   