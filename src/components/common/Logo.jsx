import { Router, Wifi } from 'lucide-react'
import { Device } from './Device'

export const Logo = () => {
   return (
      <div className="w-10 h-10 bg-blue-500 dark:bg-blue-400 rounded-2xl flex items-center justify-center">
        <Router className="w-6 h-6 text-white" />
      </div>
   )
}
