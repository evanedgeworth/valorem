"use client";

import { SidebarContext } from "@/context/sidebarContext";
import { Sidebar } from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext, useEffect } from "react";
import { TiHome } from "react-icons/ti";
import { PiClipboardTextFill } from "react-icons/pi";
import { FaUserGroup } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";
import { AnalyticIcon, InvoiceIcon } from "./icon";

export default function SidebarNav() {
  const { collapseSidebar, setCollapseSidebar } = useContext(SidebarContext);
  const pathname = usePathname();

  useEffect(() => {
    // Function to check window size and update state
    const handleResize = () => {
      setCollapseSidebar(window.innerWidth < 768);
    };

    // Initial check on component mount
    handleResize();

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Sidebar aria-label="Sidebar" className="fixed left-0" collapsed={collapseSidebar}>
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          {/* <Sidebar.Item as={Link} href="/dashboard" icon={TiHome} active={pathname === "/dashboard"} prefetch={false}>
            Home
          </Sidebar.Item> */}
          <Sidebar.Item as={Link} href="/properties" icon={PiClipboardTextFill} active={pathname === "/properties"} prefetch={false}>
            Properties
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/users" icon={FaUserGroup} active={pathname === "/users"} prefetch={false}>
            Users
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/calendar" icon={FaCalendarAlt} active={pathname === "/calendar"} prefetch={false}>
            Calendar
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/invoices" icon={InvoiceIcon} active={pathname === "/invoices"} prefetch={false}>
            Invoicing
          </Sidebar.Item>
          {/* <Sidebar.Item as={Link} href="/analytics" icon={AnalyticIcon} active={pathname === "/analytics"} prefetch={false}>
            Analytics
          </Sidebar.Item> */}
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
