import React from 'react'

function page({params}) {
  return (
    <div>
      accounts:{params.id}
    </div>
  )
}

export default page
