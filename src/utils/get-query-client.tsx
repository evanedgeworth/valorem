"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function QueryProvider({ children }: { children: JSX.Element }) {
  const [queryClient] = React.useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
