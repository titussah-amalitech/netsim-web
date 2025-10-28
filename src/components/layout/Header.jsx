import { useSelector } from "react-redux";
import { GoBack } from '../common';
import { ThemeToggle } from '../common/ThemeToggle';

export const Header = ({ showGoBack }) => {
   const { currentUser } = useSelector((state) => state.users);

   return (
      <header className="flex justify-between items-center bg-network-lighter border-network-border-light dark:bg-network-dark dark:border-network-border border-b px-6 py-4">
         {showGoBack && <GoBack />}
         <div className='flex'>
            {currentUser ? (
               <p className="text-network-text-dark dark:text-network-lighter">
                  Welcome, {currentUser.name}!
               </p>
            ) : (
               <h1 className='flex text-network-text-dark dark:text-network-text-light mx-auto font-bold'>HEADER</h1>
            )}
         </div>
         <ThemeToggle />
      </header>
   );
};
