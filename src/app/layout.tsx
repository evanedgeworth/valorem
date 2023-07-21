import { FC, PropsWithChildren } from "react";
import FlowbiteContext from "@/context/FlowbiteContext";
import "./globals.css";
import { SidebarProvider } from "@/context/SidebarContext";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <Header />
          <div className="flex dark:bg-gray-900">
            <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">
              <FlowbiteContext>{children}</FlowbiteContext>
            </main>
            <div className="order-1">
              <Sidebar />
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
};

export default RootLayout;
