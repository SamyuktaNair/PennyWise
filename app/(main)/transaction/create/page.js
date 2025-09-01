import { getUserAccounts } from '@/actions/dashboard'
import React from 'react'
import Transactionform from '../_components/Transaction-form'
import { getTransaction } from '@/actions/transaction'

const addTransactionPage=async({searchParams})=> {

  const accounts=await getUserAccounts()
  const editId=searchParams?.edit; 
  let initialData=null;
  if(editId){
    const transaction=await getTransaction(editId);
    initialData=transaction
  }
  return (
    <div>
      <h1>Add Transaction</h1>
      <Transactionform accounts={accounts}
      editMode={!!editId}
      initialData={initialData}
      />
      
    </div>
  )
}

export default addTransactionPage

