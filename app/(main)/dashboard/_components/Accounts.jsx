"use client"
import React, { useEffect } from 'react'
import { Card ,CardHeader,CardTitle,CardAction,CardContent,CardFooter} from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { updateDefaultAccount } from '@/actions/accounts'
import { toast } from 'sonner'
import { success } from 'zod'
import usefetch from '@/hooks/usefetch'

const Accounts = ({account}) => {
    const {name,balance,type,isDefault,id}=account
    // console.log(name,balance,type,isDefault)
    const {
        data:updatedAcc,
        loading,
        error,
        setData,
        func:createAccFunc
      }=usefetch(updateDefaultAccount)

      const handleChange=async(event)=>{
            event.preventDefault();
            if(isDefault){
                toast.warning("You need atleast one default account")
                return ;
            }
            await updateDefaultAccount(id)

      }
      useEffect(()=>{
        if(updatedAcc?.success){
            toast.success("Default account updated successfully")
        }
      },[updatedAcc,loading])

      useEffect(()=>{
        if(error){
            toast.error(error.message||"Failed to update default account")
        }
      },[error])
  return (
    <div>
        <Card>
            <Link href={`/accounts/${id}`}>
            <CardHeader checked={isDefault}>
                <CardTitle>{name}</CardTitle>
                <Switch checked={isDefault} disabled={loading} onClick={handleChange}/>
                
            </CardHeader>
            <CardContent>
                <div>{balance}</div>
                <p>{type}</p>
            </CardContent>
            <CardFooter>
                <ArrowUpRight className='text-green-500'/>
                    Income 
                <ArrowDownRight className='text-red-500'/>
                    Expense
                

            </CardFooter>
            </Link>
            
        </Card>
    </div>
  )
}

export default Accounts
