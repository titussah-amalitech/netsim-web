import React from 'react'
import { GoBack } from '../common'

export const Header = ({ showGoBack }) => {
   return (
      <header className="bg-network-darker border-b border-network-border px-6 py-4">
         {showGoBack && <GoBack />}
         <div className='flex '>
            <h1 className='flex text-white mx-auto font-bold'>HEADER</h1>
         </div>
      </header>
   )
}
