"use client";

import { Button, Timeline } from "flowbite-react";
import { HiArrowNarrowRight, HiCalendar } from "react-icons/hi";
import { useFormState } from "./formState";

export default function SignupProgress() {
  const { step, setStep, formData } = useFormState();

  return (
    step !== 1 && (
      <div className="w-full place-self-center mb-10 lg:col-span-6">
        <div className="">
          <ol className="flex items-center w-full text-sm font-medium text-center text-gray-500 dark:text-gray-400 sm:text-base">
            <li
              className={`flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700 cursor-pointer ${
                step > 0 && `text-cyan-700 dark:text-cyan-700`
              }`}
              onClick={() => setStep(1)}
            >
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                Type
              </span>
            </li>
            <li
              className={`flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700 cursor-pointer ${
                step > 1 && `text-cyan-700 dark:text-cyan-700`
              }`}
              onClick={() => setStep(2)}
            >
              <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                Account <span className="hidden sm:inline-flex sm:ms-2">Info</span>
              </span>
            </li>
            {formData?.accountType === "client" && (
              <li
                className={`flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700 cursor-pointer ${
                  step > 2 && `text-cyan-700 dark:text-cyan-700`
                }`}
                onClick={() => setStep(3)}
              >
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                  </svg>
                  Company <span className="hidden sm:inline-flex sm:ms-2">Info</span>
                </span>
              </li>
            )}
            <li className={`flex items-center ${step > 3 && `text-cyan-700 dark:text-blue-500`}`}>
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
              </svg>
              Confirmation
            </li>
          </ol>
        </div>
      </div>
    )
  );
}
