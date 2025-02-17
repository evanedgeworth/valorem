import { FC, PropsWithChildren } from "react";
import "@/app/globals.css";
import NavbarWithDropdown from "@/components/navbar";
import UserProvider from "@/context/userContext";
import { Flowbite, ThemeModeScript } from "flowbite-react";
import { flowbiteTheme } from "@/app/theme";
import { ToastProvider } from "@/context/toastContext";
import QueryProvider from "@/utils/get-query-client";

const RootLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <html lang="en">
      <head>
        <ThemeModeScript mode="dark" />
      </head>
      <body className="flex flex-col bg-gray-50 dark:bg-gray-900 dark:text-white">
        <QueryProvider>
          <ToastProvider>
            <UserProvider>
              <NavbarWithDropdown />
              <main className="min-h-screen">
                <div>
                  <Flowbite theme={{ mode: "dark", theme: flowbiteTheme }}>{children}</Flowbite>
                </div>
              </main>
            </UserProvider>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
