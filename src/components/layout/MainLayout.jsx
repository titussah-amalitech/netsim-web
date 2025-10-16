import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

function MainLayout() {
   const location = useLocation();

   // Hide sidebar on specific pages
   const hideSidebarRoutes = ["/scenario-editor", "/register", "/forgot-password"];
   const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

   return (
      <div className="min-h-screen flex bg-network-lighter dark:bg-network-dark overflow-hidden">
         {!shouldHideSidebar && (
            <div className="w-64 flex-shrink-0 h-screen overflow-hidden">
               <Sidebar />
            </div>
         )}

         {/* Main content area */}
         <div className="flex flex-col flex-1 h-screen overflow-hidden">
            {/* Header */}
            <div className="flex-shrink-0">
               <Header showGoBack={shouldHideSidebar} />
            </div>

            <main className="flex-1 overflow-y-auto p-6">
               <Outlet />
            </main>
         </div>
      </div>
   );
}

export default MainLayout;
