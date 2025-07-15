import React from 'react'
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-bold text-[#431376] mb-4">404</h1>
      <p className="text-xl text-gray-700 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link href="/">
        <Button> Go Home</Button>
         
        
      </Link>
    </div>
  );
}
