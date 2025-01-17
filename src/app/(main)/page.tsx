"use client";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import ScreenShot from "../../../public/main/screenshot.png"
import Image from "next/image";

export default function Home() {
  return (
    <>
      <section className="bg-black relative">
        <div className="mx-auto max-w-screen-xl py-8 px-4 text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl">
            Property management tool for<br/> rennovations
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-400 sm:px-16 lg:text-xl xl:px-48">
            Manage your rental investment properties and repair processes efficeiently
          </p>
          <div className="mb-8 flex flex-col space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4 lg:mb-16">
            <Button href="/signup" size="lg">
              Sign up
            </Button>
            <Link href="/login">
              <Button className="bg-gray-800 border-gray-600" size="lg" >
                Login
                <svg className="ml-2 -mr-1 mt-1 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
        <Image src={ScreenShot} alt="screenshot" className="w-full relative z-10" />
        <div className="w-full absolute h-96 bg-gray-800 bottom-0 z-0" />
      </section>
      <section className="bg-black py-32 text-center">
        <p className="text-2xl">Valorem</p>
        <p className="text-sm mt-2">©2025  |   All right reserved | Privacy Policy</p>
      </section>
    </>
  );
}
