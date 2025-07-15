import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { Button } from './button'
import Link from 'next/link'
import { LucideLayoutDashboard, PenBox } from 'lucide-react'
import { checkUser } from '@/lib/User'


async function Header() {
  
  await checkUser()
  return (
    <div >
      <nav className='bg-[#f4edfc] flex flex-row items-center justify-between p-2'>
      <Image src={'/logo.png'} width={80} height={60} alt='PennyWise'/>

      <div className='flex flex-row justify-between items-center gap-4'>
        <SignedIn>
          <Link href='/dashboard'>
          
            <Button  variant='outline' className='w-auto '>
              <LucideLayoutDashboard/>
              Dashboard
            </Button>
          </Link>
        <Link href='/transaction/create'>
            
            <Button variant='outline'>
            <PenBox/>
              Add Transaction
              </Button>
        </Link>
        </SignedIn>
      <SignedOut>
        <SignInButton forceRedirectUrl='/dashboard'>
          <Button variant='outline'>Login</Button>
        </SignInButton>
        
        
      </SignedOut>
      <SignedIn> 
        <UserButton appearance={{
          elements:{
            avatarBox: "w-10,h-10"
          }
        }}/>
      </SignedIn>
      </div>
      
      </nav>
      
      
    </div>
  )
}

export default Header
