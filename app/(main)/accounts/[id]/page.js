
import { getAccountDetails } from '@/actions/accounts'

// import dynamic from 'next/dynamic'
import { notFound } from 'next/navigation'
import React, { Suspense } from 'react'
import TransactionsTable from '../../dashboard/_components/TransactionsTable'
import { BarLoader } from 'react-spinners'
import AccountChart from '../../dashboard/_components/AccountChart'

const Page=async ({params}) =>{
    const accountDetails=await getAccountDetails(params.id)
    //console.log(accountDetails);
    
    if (!accountDetails){
        return notFound();
    }

    const {transactions,...account}=accountDetails
  return (
    <div>

<div className="flex m-3 justify-between items-start p-4 border rounded-xl shadow-sm bg-white">
  
  <div>
    <h1 className="text-xl font-semibold text-gray-800">{account.name}</h1>
    <p className="text-sm text-gray-500">{account.type} Account</p>
  </div>

  
  <div className="text-right">
    <div className="text-lg font-bold text-gray-900">
      Balance: ₹{account.balance}
    </div>
    <p className="text-sm text-gray-500">
      {account._count.transactions} Transactions
    </p>
  </div>
</div>
      
      <Suspense fallback={<BarLoader className='mt-4 width={"100%}'/>}>
          <AccountChart transactions={transactions}/>
      </Suspense>
      <Suspense fallback={<BarLoader className='mt-4 width={"100%}'/>}>
          <TransactionsTable transactions={transactions}/>
      </Suspense>
      
    </div>
    
  )
}

export default Page
