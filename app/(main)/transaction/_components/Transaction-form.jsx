"use client";

import React, { useEffect } from "react";
import { createTransaction, updateTransaction } from "@/actions/transaction";
import usefetch from "@/hooks/usefetch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ReceiptScanner from "./ReceiptScanner"

const Transactionform = ({ accounts, editMode = false , initialData=null}) => {
  const router = useRouter();
  const searchParams=useSearchParams();
  const editId=searchParams.get("edit")

  const { 
    data, 
    loading: transactionLoading,
     error, 
     func } = usefetch(editMode? updateTransaction:createTransaction);

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
    reset,
  } = useForm({
    defaultValues: 
    editMode && initialData? {
      type: initialData.type,
      amount: initialData.amount.toString(),
      accountId:initialData.accountId,
      category: initialData.category,
      date: new Date(initialData.date),
      description: initialData.description,
      isRecurring: initialData.isRecurring,
            ...(initialData.recurringInterval && {
              recurringInterval: initialData.recurringInterval,
      }),
    } :
    {
      type: "",
      amount: "",
      accountId: "",
      category: "",
      date: null,
      description: "",
      isRecurring: false,
      //recurringInterval: "",
    },
  });

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const onSubmit = async (data) => {
    const formData={
      ...data,
      amount:parseFloat(data.amount)
    }
    if (editMode){
      func(editId,formData)
    }
    else{
      func(formData)
    }

    
  };
  useEffect(()=>{
    if(data?.success && !transactionLoading){
      toast.success(
        editMode
        ? "Transaction updated successfully"
        : "Transaction created successfully"
        
      )
      reset()
      router.push(`/account/${data.data.accountId}`)
    }
  },[transactionLoading,data,editMode])

  const handleScan=(scannedData)=>{
    if (scannedData){
      setValue("amount", scannedData.amount.toString());
      setValue("date",new Date(scannedData.date));
      if(scannedData.description){
        setValue("description",scannedData.description)
      }
      if(scannedData.category){
        setValue("category",scannedData.category)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} 
    className="m-2 p-3">
      {!editMode && <ReceiptScanner onScanComplete={handleScan}/> }
      
      
      

      {/* Type */}
      <div className="mt-">
        <label>Type</label>
        <Select onValueChange={(value) => setValue("type", value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Expense">Expense</SelectItem>
            <SelectItem value="Income">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
      </div>

      {/* Amount */}
      <div className="mt-4">
        <label>Amount</label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register("amount", { required: "Amount is required" })}
        />
        {errors.amount && <p className="text-sm text-red-500">{errors.amount.message}</p>}
      </div>

      {/* Account */}
      <div className="mt-4"> 
        <label>Account</label>
        <Select
          onValueChange={(value) => setValue("accountId", value)}
          defaultValue={getValues("accountId")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Account" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account.id} value={String(account.id)}>
                {account.name} (Rs.{parseFloat(account.balance).toFixed(2)})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.accountId && <p className="text-sm text-red-500">{errors.accountId.message}</p>}
      </div>

      {/* Category */}
      <div className="mt-4">
        <label>Category</label>
        <Input placeholder="Enter category" {...register("category")} />
        {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
      </div>

      {/* Date Picker */}
      <div className="space-y-2 mt-4">
        <label className="text-sm font-medium">Date</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full pl-3 text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => setValue("date", selectedDate)}
              disabled={(d) => d > new Date() || d < new Date("1900-01-01")}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
      </div>

      {/* Description */}
      <div className="mt-4">
        <label>Description</label>
        <Input placeholder="Enter description" {...register("description")} />
        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
      </div>

      {/* Recurring */}
      <div className="flex flex-row mt-4 items-center justify-between rounded-lg border p-4">
        <div>
          <label className="text-base font-medium">Recurring Transaction</label>
          <p className="text-sm text-muted-foreground">
            Set up a recurring schedule for this transaction
          </p>
        </div>
        <Switch
          checked={isRecurring}
          onCheckedChange={(checked) => setValue("isRecurring", checked)}
        />
      </div>

      {/* Recurring Interval */}
      {isRecurring && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Recurring Interval</label>
          <Select
            onValueChange={(value) => setValue("recurringInterval", value)}
            defaultValue={getValues("recurringInterval")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Daily">Daily</SelectItem>
              <SelectItem value="Weekly">Weekly</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          {errors.recurringInterval && (
            <p className="text-sm text-red-500">{errors.recurringInterval.message}</p>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 mt-4" >
        <Button type="button" variant="outline" className="w-1/2" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" className="w-1/2" disabled={transactionLoading} >
            {transactionLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editMode ? "Updating..." : "Creating..."}
                </>
              ) : editMode ? (
                "Update"
              ) : (
                "Create"
              )}
        </Button>
      </div>
    </form>
  );
};

export default Transactionform;
