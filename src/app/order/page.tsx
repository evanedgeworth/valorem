"use client";

import { Timeline, Table, Badge, Dropdown } from "flowbite-react";
import { useState, useEffect, useContext } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../../types/supabase";
import { UserContext } from "@/context/userContext";

import ClientView from "./client";
import ContractorView from "./contractor";

// const DownloadPDF = dynamic(() => import("./downloadPDF"), {
//   ssr: false,
// });

export default function Page() {
  const supabase = createClientComponentClient<Database>();
  const { user, SignOut } = useContext(UserContext);

  switch (user?.role) {
    case "client":
      return <ClientView />;
    case "contractor":
      return <ContractorView />;
  }
}
