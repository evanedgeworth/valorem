"use client";
import { createContext, useState } from "react";

export const SidebarContext = createContext<any | null>(null);

export default function SidebarProvider({ children }: any) {
  const [collapseSidebar, setCollapseSidebar] = useState<boolean>(false);

  return <SidebarContext.Provider value={{ collapseSidebar, setCollapseSidebar }}>{children}</SidebarContext.Provider>;
}
