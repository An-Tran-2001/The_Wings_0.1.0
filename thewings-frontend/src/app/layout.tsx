import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="w-screen h-screen z-0 fixed blur-2xl">
          <div className="w-screen h-screen bg-cyan-200 absolute top-0 blur-2xl" style={{transform: "matrix(0.89, 0.46, -0.97, 0.23, 0, 0)"}}></div>
          <div className="w-screen h-screen bg-cyan-100 absolute top-0 blur-lg" style={{transform: "matrix(0.89, 0.46, -0.3, 0.24, 0, 0)"}}></div>
          <div className="w-screen h-screen bg-cyan-50 absolute top-0 blur-sm" style={{transform: "matrix(0.89, 0.46, 0, 0.25, 0, 0)"}}></div>
        </div>
        <div className='bg-black opacity-90'>
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  )
}
