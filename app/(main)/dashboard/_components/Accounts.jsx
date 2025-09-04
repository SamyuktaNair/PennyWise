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
        <div>
  <Card className="rounded-xl border shadow-sm">
    <Link href={`/accounts/${id}`} className="block">
      {/* Header */}
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold text-gray-800">
          {name}
        </CardTitle>
        <Switch
          checked={isDefault}
          disabled={loading}
          onClick={handleChange}
        />
      </CardHeader>

      {/* Content */}
      <CardContent className="space-y-1">
        <div className="text-xl font-bold text-gray-900">RS. {balance}</div>
        <p className="text-sm text-gray-500">{type}</p>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex justify-between items-center pt-2 text-sm font-medium">
        <div className="flex items-center gap-1 text-green-600">
          <ArrowUpRight className="h-4 w-4" />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-1 text-red-600">
          <ArrowDownRight className="h-4 w-4" />
          <span>Expense</span>
        </div>
      </CardFooter>
    </Link>
  </Card>
</div>

        {/* <Card>
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
            
        </Card> */}
    </div>
  )
}

export default Accounts
