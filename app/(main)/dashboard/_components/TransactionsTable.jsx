"use client";


import React, { useEffect, useMemo, useState } from 'react'
import { Table ,TableCaption,TableHeader,TableRow,TableHead,TableBody,TableCell} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns';
import {Tooltip,TooltipContent,TooltipTrigger} from "@/components/ui/tooltip"
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Clock, Search, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {DropdownMenu,DropdownMenuContent, DropdownMenuItem,DropdownMenuLabel,
DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import usefetch from '@/hooks/usefetch';
import { deleteTransactions } from '@/actions/accounts';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';




const TransactionsTable = ({transactions}) => {
  const router=useRouter()
  const [search,setSearch]=useState("");
  const [type,setType]=useState("");
  const [recurring,setRecurring]=useState("");
  const [selectedIds,setSelectedIds]=useState([]);
  const [sort,setSort]=useState({
    field:"date",
    direction:"desc"
  })

  const {
    loading,
    func,
    data,

  }=usefetch(deleteTransactions)


  const filteredTransactions=useMemo(()=>{
    let result=[...transactions]

    if (search){
      const searchLower=search.toLowerCase();
      result=result.filter((transaction)=>transaction.description?.toLowerCase().includes(searchLower)
        
      )
      
    }

    if(recurring){
      result=result.filter((transaction)=>{
        if(recurring==='recurring') return transaction.isRecurring;

        return !transaction.isRecurring
      })
    }
    if(type){
      result=result.filter((transaction)=>transaction.type===type
        
      )
    }

    result.sort((a,b)=>{
      let comparison=0;
      switch (sort.field){
        case "date":
          comparison=new Date(a.date)-new Date(b.date);
          break
      }
      return sort.direction==='asc' ? comparison: -comparison
    })


    return result
  },[
    transactions,
    search,
    type,
    recurring,
    sort
  ])


  

  
  
  const handleSort=(field)=>{
    setSort((current)=>{
      const newDirection=current.field===field && current.direction==="desc"?"asc":"desc";
      return {
        field:current.field,
        direction:newDirection
      }
      
    })
  }

  const handleSelect=(id)=>{
    setSelectedIds((current)=>{
      if (current.includes(id)){
        return current.filter((item)=>item!=id)
      }
      else{
        return [...current,id]
      }
      
    })
    
  }
  const handleSelectAll=()=>{
    setSelectedIds((current)=>{
      if (current.length >0){
        return []
      }
      else{
        return filteredTransactions.map((t)=>t.id)
      }
      
    })
  }

  // filters
  

  const handleDelete=()=>{
      if(
        !window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions ?`)
      )
      return ;

      func(selectedIds)
  }
  const handleClearFilters=()=>{
    setSearch("")
    setType("")
    setRecurring("")
    setSelectedIds([])
  }

  useEffect(()=>{
    if(data && !loading){
      toast.error("Transactions deleted successfully")
    }
  },[
    data,loading
  ])
  return (
    <div>
      {loading &&(
        <BarLoader width={"100%"}/>
      )}
      {/* Filters */}
      <div>

      
      <div className='m-4'>
        <Search className="absolute mx-2 my-2.5 text-gray-400 h-4 w-4"/>
        <Input type='text' placeholder="Search Transactions" value={search} onChange={(e)=>setSearch(e.target.value)} className="px-7"/>
      </div>
      <div className='m-4 flex gap-2'>
      <Select value={type} onValueChange={(value)=>setType(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Types" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Income">Income</SelectItem>
          <SelectItem value="Expense">Expense</SelectItem>
          
        </SelectContent>
      </Select>

      <Select value={recurring} onValueChange={(value)=>setRecurring(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="All Transactions" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recurring">Recurring</SelectItem>
          <SelectItem value="non-recurring">Non-Recurring</SelectItem>
          
        </SelectContent>
      </Select>
      {
        selectedIds.length>0 && (
          <div>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash/>
              Delete Selected({selectedIds.length})</Button>
          </div>


        )
      }
      {(search||type||recurring)&&(
        <Button variant='outline' onClick={handleClearFilters} title="Clear Filters" >X</Button>
      )}

      </div>
      </div>


    {/* Transactions */}
    <div className='m-4 rounded-md border-2'>
        <Table>
            <TableCaption>A list of your recent transactions.</TableCaption>
            <TableHeader>
                <TableRow className='border-2'>
                <TableHead className="w-[50px]"><Checkbox onCheckedChange={handleSelectAll}
                 checked={selectedIds.length===filteredTransactions.length && filteredTransactions.length>0}
                 /></TableHead>
                <TableHead className=" cursor-pointer" 
                onClick={()=>handleSort("date")}>
                  <div className='flex items-center'>
                  Date {sort.field==='date' && (
                    sort.direction=='desc' ? <ChevronUp /> :<ChevronDown/>
                  )}
                  </div>
                
                </TableHead>

                <TableHead>Description</TableHead>

                <TableHead className=" cursor-pointer" 
                >
                  <div className='flex items-center'>Category</div>
                
                </TableHead>

                <TableHead className=" cursor-pointer" 
                onClick={()=>handleSort("amount")}>
                  <div className='flex items-center'>Amount
                     {/* {sort.field==="amount" &&(
                    sort.direction=='desc'?<ChevronUp/> :<ChevronDown/>
                  )} */}
                  </div>
                
                </TableHead>
                <TableHead>Recurring</TableHead>
                
                </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions===0?(
                <TableRow>
                  <TableCell colSpan={7} className="text-center">
                    No Transactions found for this Account
                  </TableCell>
                </TableRow>
              ):(
                filteredTransactions.map((transaction)=>(
                  <TableRow key={transaction.id}>
                <TableCell >
                  <Checkbox onCheckedChange={()=>handleSelect(transaction.id)} checked={selectedIds.includes(transaction.id)}
                    />
                </TableCell>
                <TableCell>{format(new Date(transaction.date),"PP")}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell >{transaction.category}</TableCell>
                <TableCell className='font-medium' style={
                  {
                    color:transaction.type==="Expense" ? "red" :"green",
                    
                  }
                }>
                  {transaction.type==='Expense'? "-" :"+"}
                  Rs. {transaction.amount}
                </TableCell>
                <TableCell >{transaction.isRecurring?(
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant='outline' className='gap-1 bg-[#f4edfc] hover:font-bold text-[#431376]'>
                        <Clock/>
                          {transaction.recurringInterval}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div>
                          <div>Next Date:</div>
                          <div>{format(new Date(transaction.nextRecurringDate),"PP")}</div>
                        </div>
                      </TooltipContent>
                  </Tooltip>
                ):(
                  <Badge variant="outline" className='gap-1'>
                    <Clock/>
                    One-time
                    </Badge>
                )}</TableCell>

                <TableCell>
                  <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant='ghost'>...</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                   
                    <DropdownMenuItem onClick={()=>router.push(
                      `/transaction/create?edit=${transaction.id}`
                    )}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem className='text-red-700' onClick={()=>func([transaction.id])}>Delete</DropdownMenuItem>
                    
                  </DropdownMenuContent>
                </DropdownMenu>

              </TableCell>
                </TableRow>

                ))

                
              )}
              
                
            </TableBody>
        </Table>
      
    </div>
    </div>
  )
}

export default TransactionsTable
