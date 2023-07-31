import { FC, PropsWithChildren } from "react";
import FlowbiteContext from "@/context/FlowbiteContext";
import "./globals.css";
import NavbarWithDropdown from "@/components/navbar";
import UserProvider from "@/context/userContext";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col dark:bg-gray-900">
        <UserProvider>
          <NavbarWithDropdown />
          <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="max-w-6xl mr-auto ml-auto">
              <FlowbiteContext>{children}</FlowbiteContext>
            </div>
          </main>
        </UserProvider>
      </body>
    </html>
  );
};

export default RootLayout;
