"use client"
import React, { useEffect, useRef } from 'react'
import usefetch from "@/hooks/usefetch";
import { scanReceipt } from "@/actions/transaction";
import { Button } from "@/components/ui/button";
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ReceiptScanner = ({onScanComplete}) => {
    const fileInputRef=useRef();

    const{
        data,
        loading,
        error,
        setData,
        func
    }=usefetch(scanReceipt)

    const handleReceiptScan=async (file)=>{
        if (file.size > 5 *1024*1024){
            toast.error("File size should be less than 5 MB")
            return
        }
        await func(file)
    };
    useEffect(()=>{
        if(data && !loading){
            onScanComplete(data);
            toast.success("Receipt scanned successfully")
        }

    },[loading,data])

  return (
    <div>
      <input 
      type='file' 
      ref={fileInputRef}
      className='hidden'
      accept='image/*'
      capture="environment"
      onChange={(e)=>{
        const file=e.target.files?.[0];
        if (file) handleReceiptScan(file)
      }}    
      />
      <Button onClick={()=>fileInputRef.current?.click()}>
        {
            loading?(
                <>
                <Loader2 className='mr-2 animate-spin'/>
                <span>Scanning Receipt...</span>
                </>
            ):(
                <>
                {" "}
                <Camera className='mr-2'/>
                <span>Scan Receipt & Autofill</span>
                </> 
            )
        }
      </Button>
    </div>
  )
}

export default ReceiptScanner
