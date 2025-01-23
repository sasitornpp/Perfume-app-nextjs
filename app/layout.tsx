import { createServer } from '@/utils/supabase/server'
import { GeistSans } from 'geist/font/sans'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import React from 'react'
import { UserProvider } from '@/context/UserContext'
import ProviderComponent from '@/app/provider'

export default async function RootLayout ({
  children
}: {
  readonly children: React.ReactNode
}) {
  const supabaseServer = await createServer()
  const {
    data: { user }
  } = await supabaseServer.auth.getUser()

  const { data: profiles } = await supabaseServer
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <html lang='en' className={GeistSans.className} suppressHydrationWarning>
      <body className='antialiased h-screen w-screen bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='Light'
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider user={user} profile={profiles}>
            <ProviderComponent user={await profiles}>
              {children}
            </ProviderComponent>
          </UserProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
