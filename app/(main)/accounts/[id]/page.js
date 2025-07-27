
import { getAccountDetails } from '@/actions/accounts'

// import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import TransactionsTable from '../../dashboard/_components/TransactionsTable'
import { BarLoader } from 'react-spinners'

const Page=async ({params}) =>{
    const accountDetails=await getAccountDetails(params.id)
    console.log(accountDetails);
    
    if (!accountDetails){
        return notFound();
    }

    const {transactions,...account}=accountDetails
  return (
    <div>

   
      <div className='flex '>
        <div>
          <h1>{account.name}</h1>
            <p>{account.type } Account</p>
        
        </div>
        <div>
          <div>
            Balance: Rs. {account.balance}
          </div>
          <p>{account._count.transactions} Transactions</p>
        </div>
        
      </div>
      <Suspense fallback={<BarLoader className='mt-4 width={"100%}'/>}>
          <TransactionsTable transactions={transactions}/>
      </Suspense>
      
    </div>
    
  )
}

export default Page
