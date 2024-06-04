"use client";

import { Spinner } from "flowbite-react";

export default function Loading() {
  return (
    <div className="flex justify-center items-center flex-1 h-screen">
      <Spinner aria-label="Loading" size="xl" />
    </div>
  );
}
