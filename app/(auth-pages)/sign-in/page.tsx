import React from 'react'
import { useSearchParams } from 'next/navigation';
import { signInAction } from '@/utils/api/actions-server'
import { FormMessage, Message } from '@/components/form-message'
import { SubmitButton } from '@/components/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createServer } from '@/utils/supabase/server'

/**
 * ฟังก์ชันนี้จะแสดงฟอร์มลงชื่อเข้าใช้
 * โดยจะแสดงข้อความที่ต้องการลงชื่อเข้าใช้
 * และเมื่อส่งข้อมูลฟอร์มจะเรียกใช้ `signInAction`
 * เพื่อดำเนินการลงชื่อเข้าใช้ในส่วนหลังของระบบ
 * @param searchParams - ข้อความที่จะแสดงในฟอร์ม
 */

export default async function Login ({
  searchParams // ?error=Passwords%20do%20not%20match
}: Readonly<{ searchParams: Message }>) {
  const supabase = await createServer()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (user) {
    return redirect('/')
  }

  return (
    <form className='flex-1 flex flex-col min-w-64 h-full'>
      <h1 className='text-2xl font-medium'>Sign in</h1>
      <p className='text-sm text-foreground'>
        Don&apos;t have an account?{' '}
        <Link className='text-foreground font-medium underline' href='/sign-up'>
          Sign up
        </Link>
      </p>
      <div className='flex flex-col gap-2 [&>input]:mb-3 mt-8'>
        <Label htmlFor='email'>Email</Label>
        <Input name='email' placeholder='you@example.com' required />
        <div className='flex justify-between items-center'>
          <Label htmlFor='password'>Password</Label>
          <Link
            className='text-xs text-foreground underline'
            href='/forgot-password'
          >
            Forgot Password?
          </Link>
        </div>
        <Input
          type='password'
          name='password'
          placeholder='Your password'
          required
        />
        <SubmitButton pendingText='Signing In...' formAction={signInAction}>
          Sign in
        </SubmitButton>
        <FormMessage message={await searchParams} />
      </div>
    </form>
  )
}
