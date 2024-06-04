"use client";

import { SidebarContext } from "@/context/sidebarContext";
import { Badge, Sidebar } from "flowbite-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { HiArrowSmRight, HiChartPie, HiInbox, HiOutlineClipboardList, HiBell, HiTable, HiUser, HiViewBoards, HiCalendar } from "react-icons/hi";
import { HiBolt } from "react-icons/hi2";
import { RiMoneyDollarBoxLine, RiSettings3Fill } from "react-icons/ri";
import { TbDeviceIpadDollar } from "react-icons/tb";

export default function SidebarNav() {
  const { collapseSidebar, setCollapseSidebar } = useContext(SidebarContext);
  const pathname = usePathname();
  const router = useRouter();

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
          <Sidebar.Item as={Link} href="/dashboard" icon={HiChartPie} active={pathname === "/dashboard"} prefetch={false}>
            Dashboard
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/order" icon={HiBolt} active={pathname === "/order"} prefetch={false}>
            Orders
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/inbox" icon={HiInbox} active={pathname === "/inbox"} prefetch={false}>
            Inbox
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/users" icon={HiUser} active={pathname === "/users"} prefetch={false}>
            Users
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/notifications" icon={HiBell} active={pathname === "/notifications"} prefetch={false}>
            Notifications
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/calendar" icon={HiCalendar} active={pathname === "/calendar"} prefetch={false}>
            Calendar
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/invoices" icon={TbDeviceIpadDollar} active={pathname === "/invoices"} prefetch={false}>
            Invoicing
          </Sidebar.Item>
          <Sidebar.Item as={Link} href="/settings" icon={RiSettings3Fill} active={pathname === "/settings"} prefetch={false}>
            Settings
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>

      {/* <Sidebar.CTA>
        <div className="mb-3 flex items-center">
          <Badge color="warning">Beta</Badge>
          <button
            aria-label="Close"
            className="-m-1.5 ml-auto inline-flex h-6 w-6 rounded-lg bg-gray-100 p-1 text-cyan-900 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600"
            type="button"
          >
            <svg aria-hidden className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="mb-3 text-sm text-cyan-900 dark:text-gray-400">
          Preview the new Flowbite dashboard navigation! You can turn the new navigation off for a limited time in your profile.
        </div>
        <a className="text-sm text-cyan-900 underline hover:text-cyan-800 dark:text-gray-400 dark:hover:text-gray-300" href="#">
          Turn new navigation off
        </a>
      </Sidebar.CTA> */}
    </Sidebar>
  );
}
