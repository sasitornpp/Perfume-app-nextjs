import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import React from 'react'
import ProviderComponent from '@/app/provider'

export default async function RootLayout ({
  children
}: {
  readonly children: React.ReactNode
}) {


  return (
    <html lang='en' className={GeistSans.className} suppressHydrationWarning>
      <body className='antialiased h-screen w-screen bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='Light'
          enableSystem
          disableTransitionOnChange
        >
            <ProviderComponent >
              {children}
            </ProviderComponent>
        </ThemeProvider>
      </body>
    </html>
  )
}
