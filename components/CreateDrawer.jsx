"use client"
import React, { useEffect, useState } from 'react'
import { Drawer ,DrawerTrigger,DrawerContent,DrawerHeader,DrawerTitle, DrawerClose} from './ui/Drawer'
import { Select, SelectTrigger,SelectValue,SelectContent,SelectItem} from './ui/select'
import { Controller, useForm } from 'react-hook-form'
import { Switch } from './ui/switch'
import { Button } from './ui/button'
import usefetch from '@/hooks/usefetch'
import { dashboard } from '@/actions/dashboard'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const CreateDrawer = ({children}) => {
    const {
        register,
        handleSubmit,
        watch,
        reset,
        onValueChange,
        defaultValue,
        setValue,
        control,
        formState:{errors}
    }=useForm({
      defaultValues:{
        isDefault:false,
      }
    })

    const {
      data:newAcc,
      loading,
      error,
      setData,
      func:createAccFunc
    }=usefetch(dashboard)

    useEffect(()=>{
      if(newAcc && !loading){
        toast.success("Account created successfully");
        reset();
        setOpen(false);
        setData(undefined);
      }
    },[loading,newAcc])

    useEffect(()=>{
      if(error){
        toast.error(error.message|| "Failed to create account")
      }
    },[error])

    const onSubmit=async (data)=>{
      // console.log("Form data: ",data)
        await createAccFunc(data)
    }

    const [open,setOpen]=useState(false)
  return (
    <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{children}</DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
            <DrawerTitle className='text-2xl text-left'>Create New Account </DrawerTitle>
            
            </DrawerHeader>
            <div className='p-4'>
              <form action="" onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-2'>
                <div className='flex flex-col gap-1'>
                  <label htmlFor="name" className='text-lg'>Account Name</label>
                  <input type='text' placeholder='Eg: Leisure' {...register("name",{required:{value:true,message:"This field cannot be empty"}})} className='border-2 rounded-l h-10 p-2'/>
                  {errors.name && <div className='text-red-600'>{errors.name.message}</div>}
                </div>

                <div className='flex flex-col gap-1'>
                  <label htmlFor="type" className='text-lg'>Account Type</label>
                 
                  <Controller
                  name="type"
                  control={control}   
                  rules={{ required: "This field cannot be empty" }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full" id="type">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Current">Current</SelectItem>
                        <SelectItem value="Savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                  
                  
                  {errors.type && <div className='text-red-600'>{errors.type.message}</div>}
                </div>

                <div className='flex flex-col gap-1'>
                  <label htmlFor="balance" className='text-lg'>Initial Balance</label>
                  <input type='number' step='0.01' placeholder='0.00' {...register("balance",{required:{value:true,message:"This field cannot be empty"}})} className='border-2 rounded-l h-10 p-2'/>
                  {errors.balance && <div className='text-red-600'>{errors.balance.message}</div>}
                </div>

                <div className='flex flex-col gap-1'>
                  <label htmlFor="isDefault" className='text-lg'>Set as default</label>
                  
                  <div className='flex justify-between items-center border-2 p-2'>
                    <p>This account will be set as default </p>
                    <Switch id='isDefault'
                    onCheckedChange={(checked)=>setValue("isDefault",checked)} checked={watch("isDefault")}/>
                  </div>
                  
                  
                </div>
                <div className='flex gap-2'>
                  <DrawerClose asChild>
                    <Button variant='outline'>
                      Cancel
                    </Button>
                  </DrawerClose>
                  <Button type='submit' disabled={loading} >
                    {loading?
                    (
                      <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin'/>
                      Creating.....
                      </>
                    ):
                    (
                      "Create Account "
                    )}
                    </Button>
                </div>
              </form>
            </div>
            
        </DrawerContent>
    </Drawer>
  )
}

export default CreateDrawer
