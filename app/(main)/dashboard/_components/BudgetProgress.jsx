"use client"

import React, { useEffect, useState } from 'react'
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Pencil, X } from 'lucide-react';
import usefetch from '@/hooks/usefetch';
import { toast } from 'sonner';
import { updateBudget } from '@/actions/budget';
import { Progress } from '@/components/ui/progress';

const BudgetProgress = ({initialBudget,currentExpenses}) => {
    const [isEditing,setisEditing]=useState(false);
    const [newBudget,setnewBudget]=useState(initialBudget?.amount?.toString() || "")

    const percentageUsed=initialBudget ? (currentExpenses/ initialBudget.amount) * 100 :0;

    const {
      loading:isLoading,
      func:updateBudgetfn,
      data:updatedBudget,
      error
    }=usefetch(updateBudget)

    useEffect(()=>{
      if(updateBudget ?.success){
        setisEditing(false);
        toast.success("Budget updated successfully")
      }
    },[updateBudget])

    useEffect(()=>{
      if (error){
        toast.error(error.message || "Failed to update budget")
      }
    },[error])
     
    const handleUpdateBudget=async ()=>{
      const amount=parseFloat(newBudget);
      if (isNaN(amount) || amount<=0){
        toast.error("Please enter a valid amount")
        return
      }
      await updateBudgetfn(amount)
    }
    const handleCancel=()=>{
      setnewBudget(initialBudget?.amount?.toString() || "");
    }
  return (
    <div>
        <Card>
        <CardHeader>
            <CardTitle>Monthly Budget (Default Account)</CardTitle>
            <div>
              {isEditing ? (
                <>
                
                <Input type="number"
                value={newBudget}
                onChange={(e)=>setnewBudget(e.target.value)}
                className="w-32"
                placeholder="Enter Budget"
                autoFocus
                disabled={isLoading}
                />
                <Button variant="ghost" size="icon" onClick={handleUpdateBudget} disabled={isLoading}>
                    <Check className='h-4 w-4 text-green-500'/>
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancel}disabled={isLoading}>
                   <X className='h-4 w-4 text-red-500'/>
                </Button>
            </>
              ) :(
                <></>
              )}
            </div>
            
            <CardDescription>
                {initialBudget ?
                `Rs ${currentExpenses} of ${initialBudget.amount} spent`: 
                "No Budget Set" }
            </CardDescription>
            <Button variant="ghost" size="icon" onClick={()=>setisEditing(true)}>
              <Pencil className='h-3 w-3'/>
            </Button>
        </CardHeader>
        <CardContent>
            {initialBudget && (
              <div className='space-y-2'>
                  <Progress value={percentageUsed}
                    extraStyles={`${
                      percentageUsed>=90
                      ? "bg-red-500"
                      : percentageUsed>=75
                      ? "bg-yellow-500"
                      :"bg-green-500"
                    }`}
                  />
                  <p className='text-xs texxt-muted-foreground text-right'>{percentageUsed.toFixed(1)} % used</p>
              </div>
              
            )}
        </CardContent>
        
        </Card>
      
    </div>
  )
}

export default BudgetProgress
