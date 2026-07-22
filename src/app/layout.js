import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://samyak.org'),
  title: 'Samyak Properties | Property Sell and Purchase in Pilkhuwa, Hapur',
  description: 'Top-rated real estate agency for property sell and purchase in Pilkhuwa and Hapur. Find premium plots, homes, and commercial spaces with Samyak Properties.',
  keywords: ['Property in Pilkhuwa', 'Property in Hapur', 'Real Estate Pilkhuwa', 'Buy Plot Hapur', 'Samyak Properties', 'Commercial Land Pilkhuwa'],
  openGraph: {
    title: 'Samyak Properties | Property Sell and Purchase in Pilkhuwa, Hapur',
    description: 'Find premium plots, homes, and commercial spaces with Samyak Properties in Pilkhuwa and Hapur.',
    url: '/',
    siteName: 'Samyak Properties',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Samyak Properties | Real Estate in Pilkhuwa & Hapur',
    description: 'Find your dream plot, land, or home with Samyak Properties.',
  },
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
