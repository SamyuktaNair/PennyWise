import { getUserAccounts } from '@/actions/dashboard'
import React from 'react'
import Transactionform from '../_components/Transaction-form'

const addTransactionPage=async()=> {
  const accounts=await getUserAccounts()
  return (
    <div>
      <h1>Add Transaction</h1>
      <Transactionform accounts={accounts}/>
      
    </div>
  )
}

export default addTransactionPage

