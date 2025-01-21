"use client";

import { useFormState } from "./formState";

function Icon() {
  return (
    <svg className="mb-1" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_2007_7667)">
        <path d="M19.1272 8.39384L18.2355 7.50102C18.0469 7.31332 17.9436 7.06305 17.9436 6.79789V5.53464C17.9436 3.89201 16.6071 2.55527 14.9648 2.55527H13.7017C13.4406 2.55527 13.1844 2.449 12.9997 2.26428L12.107 1.37147C10.9453 0.209512 9.0567 0.209512 7.89495 1.37147L7.0003 2.26428C6.81561 2.449 6.55943 2.55527 6.29828 2.55527H5.03525C3.39291 2.55527 2.0564 3.89201 2.0564 5.53464V6.79789C2.0564 7.06305 1.95313 7.31332 1.76547 7.50102L0.872803 8.39284C0.309801 8.95594 0 9.70476 0 10.5002C0 11.2957 0.310793 12.0446 0.872803 12.6067L1.76447 13.4995C1.95313 13.6872 2.0564 13.9374 2.0564 14.2026V15.4659C2.0564 17.1085 3.39291 18.4452 5.03525 18.4452H6.29828C6.55943 18.4452 6.81561 18.5515 7.0003 18.7362L7.89296 19.63C8.47384 20.21 9.23642 20.5 9.99901 20.5C10.7616 20.5 11.5242 20.21 12.1051 19.629L12.9977 18.7362C13.1844 18.5515 13.4406 18.4452 13.7017 18.4452H14.9648C16.6071 18.4452 17.9436 17.1085 17.9436 15.4659V14.2026C17.9436 13.9374 18.0469 13.6872 18.2355 13.4995L19.1272 12.6077C19.6892 12.0446 20 11.2967 20 10.5002C20 9.70376 19.6902 8.95594 19.1272 8.39384ZM14.5229 9.34028L8.56519 13.3128C8.39738 13.425 8.20475 13.4796 8.0141 13.4796C7.75792 13.4796 7.50372 13.3803 7.31209 13.1886L5.32618 11.2024C4.93794 10.8141 4.93794 10.1864 5.32618 9.79811C5.71443 9.4098 6.34197 9.4098 6.73022 9.79811L8.14021 11.2083L13.4207 7.68773C13.8785 7.38284 14.4941 7.50598 14.7979 7.96282C15.1028 8.41966 14.9796 9.03639 14.5229 9.34028Z" fill="#F5F5F5" />
      </g>
      <defs>
        <clipPath id="clip0_2007_7667">
          <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default function SignupProgress() {
  const { step, setStep, formData } = useFormState();

  return (
    <div className="w-full place-self-center mb-10 lg:col-span-6">
      <div className="">
        <ol className="flex items-center w-full text-sm font-medium text-center  sm:text-base">
          <li
            className={`flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700 cursor-pointer ${step > 0 ? `text-white` : `text-gray-400`
              }`}
            onClick={() => setStep(1)}
          >
            <span className="flex items-center flex-col whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              {
                step > 0 ? (
                  <Icon />
                ) : <div>1</div>
              }
              Personal Info
            </span>
          </li>
          <li
            className={`flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700 cursor-pointer ${step > 1 ? `text-white` : `text-gray-400`
              }`}
            onClick={() => setStep(2)}
          >
            <span className="flex items-center flex-col whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              {
                step > 1 ? (
                  <Icon />
                ) : <div>2</div>
              }
              Account Info
            </span>
          </li>
          <li
            className={`flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700 cursor-pointer ${step > 2 ? `text-white` : `text-gray-400`
              }`}
            onClick={() => setStep(3)}
          >
            <span className="flex items-center flex-col whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              {
                step > 2 ? (
                  <Icon />
                ) : <div>3</div>
              }
              Company Info
            </span>
          </li>
          <li className={`flex items-center ${step > 3 ? `text-white` : `text-gray-400`}`}>
            <span className="flex items-center flex-col whitespace-nowrap after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
              {
                step > 3 ? (
                  <Icon />
                ) : <div>4</div>
              }
              Confirmation
            </span>
          </li>
        </ol>
      </div>
    </div>
  );
}
