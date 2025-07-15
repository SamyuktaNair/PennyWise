import React, { Suspense } from 'react'
import DashboardPage from './page'
import {BarLoader} from 'react-spinners'

function layout() {
  return (
    <div className='px-5'>
        <Suspense
        fallback={<BarLoader className='mt-2' color='#431376'/>}
        >
        <DashboardPage/>
        </Suspense>
      
    </div>
  )
}

export default layout
