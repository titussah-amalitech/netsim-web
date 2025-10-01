import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

function MainLayout() {
   const location = useLocation();

   // Hide sidebar on these pages
   const hideSidebarRoutes = ["/scenario-editor", "/register", "/forgot-password"];
   const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

   return (
      <div className="min-h-screen bg-network-lighter dark:bg-network-dark flex">
         {!shouldHideSidebar && <Sidebar />}

         <div className="flex-1 flex flex-col">
            <Header showGoBack={shouldHideSidebar} />
            <main className="flex-1 p-6">
               <Outlet />
            </main>
         </div>
      </div>
   )
}

export default MainLayout;