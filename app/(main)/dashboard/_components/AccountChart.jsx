"use client"

import { endOfDay, format, startOfDay, subDays } from 'date-fns';
import React, { useMemo, useState } from 'react';
import { ResponsiveContainer,BarChart ,Rectangle,CartesianGrid,XAxis,YAxis,Tooltip,Legend,Bar} from 'recharts';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const DateRanges={
    '7D':{label: "Last 7 Days", days:7},
    '1M':{label: "Last 1 Month", days:30},
    '3M':{label: "Last 3 Months", days:90},
    '6M':{label: "Last 6 Months", days:180},
    All:{label: "All", days:null}
}


const AccountChart = ({transactions}) => {
    const [dateRange, setDateRange]=useState("1M")

    const filteredData=useMemo(()=>{
        const range=DateRanges[dateRange]
        const now=new Date();
        const startDate=range.days ? startOfDay(subDays(now,range.days)) : startOfDay(new Date(0))

        const filtered=transactions.filter(
            (t)=> new Date(t.date) >=startDate && new Date(t.date)<=endOfDay(now)
        )

        const grouped =filtered.reduce((acc,transaction)=>{
            const date=format(new Date(transaction.date),"MMM dd");

            if(!acc[date]){
                acc[date]={date, income:0,expense:0};
            }

            if(transaction.type==="Income"){
                acc[date].income+=transaction.amount;
            }
            else{
                acc[date].expense+=transaction.amount;
            }

            return acc;
        },{})

        return Object.values(grouped).sort(
            (a,b)=>new Date(a.date)-new Date(b.date)
        )
    },[transactions,dateRange])

    const totals=useMemo(()=>{
        return filteredData.reduce((acc,day)=>({
            income:acc.income +day.income,
            expense:acc.expense + day.expense,
        }),
        {income:0,expense:0}
    );
    },[filteredData])

    //console.log(filteredData);
    
  return (
    <div className='m-4'>
        <Card> 
        <CardHeader className=" flex flex-row items-center justify-between  ">
            <CardTitle>Transaction History</CardTitle>
            <Select defaultValue={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Date Range" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(DateRanges).map(([key,{label}])=>{
                    return(
                        <SelectItem key={key} value={key}>
                        {label}
                    </SelectItem>
                    )
                    
                })}
            </SelectContent>
            </Select>
           
        </CardHeader>
        <CardContent>
            <div className='flex justify-around '>
                <div className='text-center'>
                    <p className='text-muted-foreground'>Total Income</p>
                    <p className='text-lg font-bold text-green-500'>${totals.income}</p>
                </div>
                <div className='text-center'>
                    <p className='text-muted-foreground'>Total Expense</p>
                    <p className='text-lg font-bold text-red-500'>${totals.expense}</p>
                </div>
                <div className='text-center'>
                    <p className='text-muted-foreground'>Overall</p>
                    <p className={`text-lg font-bold ${
                        totals.income-totals.expense>=0 ? "text-green-500" : "text-red-500"
                    }`}>${totals.income-totals.expense}</p>
                </div>
            </div>
            <div className='h-[400px]'>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                    
                    data={filteredData}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                    >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis  
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value)=>`Rs. ${value}`}/> 
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="income" fill="#8884d8"  radius={[4,4,0,0]} />
                    <Bar dataKey="expense" fill="#82ca9d" radius={[4,4,0,0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            
        </CardContent>
        
        </Card>
        
      
    </div>
  )
}

export default AccountChart
