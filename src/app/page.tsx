"use client";
import Image from "next/image";
import React, { useState } from "react";
import { BiBuoy } from "react-icons/bi";
import {
  HiAdjustments,
  HiArrowNarrowRight,
  HiArrowSmRight,
  HiChartPie,
  HiCheck,
  HiClipboardList,
  HiCloudDownload,
  HiDatabase,
  HiExclamation,
  HiEye,
  HiHome,
  HiInbox,
  HiOutlineAdjustments,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiUserCircle,
  HiViewBoards,
  HiX,
} from "react-icons/hi";
import Header from "../components/header";
import Sidebar from "../components/sidebar";
import { SidebarProvider } from "../context/SidebarContext";

// export default function Index(): JSX.Element {
//   return (
//     <SidebarProvider>
//       <Header />
//       <div className="flex dark:bg-gray-900">
//         <main className="order-2 mx-4 mt-4 mb-24 flex-[1_0_16rem]">
//           <Page />
//         </main>
//         <div className="order-1">
//           <Sidebar />
//         </div>
//       </div>
//     </SidebarProvider>
//   );
// }

export default function Page(): JSX.Element {
  return (
    <header>
      <h1 className="mb-6 text-5xl font-extrabold dark:text-white">
        Welcome to <code>Flowbite</code> on <code>Next.js</code>!
      </h1>
    </header>
  );
}
