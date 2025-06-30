import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/hooks/use-language'

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
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
