import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Samyak Properties | Trusted Property Deals in Pilkhuwa & Hapur',
  description: 'Find your dream plot, land, or home with Samyak Properties. Premium real estate listings in Pilkhuwa and Hapur.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
