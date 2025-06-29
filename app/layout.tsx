import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'JDR Board',
  description: 'Manage your RPG zones and characters',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
