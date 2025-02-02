"use client";

import { Button } from "flowbite-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = "com.blakecross.valorem://";
    }
  }, []);
  return (
    <section>
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Email Confirmed!</h1>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            If you are on a mobile device, please open the Valorem app to continue.
          </p>
          <Link href="/" className="inline-flex ">
            <Button color="gray">Continue to Web</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
