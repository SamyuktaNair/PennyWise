
import { getUserAccounts } from '@/actions/dashboard'
import CreateDrawer from '@/components/CreateDrawer'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import React from 'react'
import Accounts from './_components/Accounts'
import { getBudget } from '@/actions/budget'
import BudgetProgress from './_components/BudgetProgress'




const DashboardPage = async() => {
  const accounts=await getUserAccounts()
  
  const defaultAccount= accounts?.find((account)=>account.isDefault);

  let budgetData=null
  if (defaultAccount){
    budgetData=await getBudget(defaultAccount.id)
  }
  return (
    <div>
      <div className="text-2xl font-bold text-gray-800 p-4 text-center">
        Dashboard
      </div>
      
      {/* Monthly Budget display */}
      {defaultAccount && (
        <BudgetProgress initialBudget={budgetData.budget}
           currentExpenses={budgetData?.currentExpenses || 0}
        />
      )}

      {/* Recent transaction-according to account selected */}

      {/* Display accounts and section for add new account */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-3'>
        <CreateDrawer>
          <Card>
            <CardContent>
              <Plus className='h-10 w-10 mb-2'/>
              <p className=''>Add new Account </p>
            </CardContent>
          </Card>
        </CreateDrawer>

        {accounts.length>0 && 
        accounts?.map((account)=>{
          return <Accounts key={account.id} account={account}/>
        })}


      </div>
      
    </div>
  )
}

export default DashboardPage
