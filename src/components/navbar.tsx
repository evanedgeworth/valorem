"use client";
import { useContext } from "react";
import { Dropdown, Navbar, Avatar, Button } from "flowbite-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";

export default function NavbarWithDropdown() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const { user, SignOut } = useContext(UserContext);

  // async function SignOut() {
  //   let { error } = await supabase.auth.signOut();
  //   if (error) {
  //     alert(error.message);
  //   }
  //   router.push("/");
  // }

  return (
    // <Navbar fluid rounded>
    //   <Navbar.Brand href="https://flowbite-react.com">
    //     {/* <img alt="Flowbite React Logo" className="mr-3 h-6 sm:h-9" src="/favicon.svg" /> */}
    //     <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Valorem</span>
    //   </Navbar.Brand>
    //   <div className="flex md:order-2">
    //     <Dropdown inline label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}>
    //       <Dropdown.Header>
    //         <span className="block text-sm">Bonnie Green</span>
    //         <span className="block truncate text-sm font-medium">name@flowbite.com</span>
    //       </Dropdown.Header>
    //       <Dropdown.Item>Dashboard</Dropdown.Item>
    //       <Dropdown.Item>Settings</Dropdown.Item>
    //       <Dropdown.Item>Earnings</Dropdown.Item>
    //       <Dropdown.Divider />
    //       <Dropdown.Item onClick={SignOut}>Sign out</Dropdown.Item>
    //     </Dropdown>
    //     <Navbar.Toggle />
    //   </div>
    //   <Navbar.Collapse>
    //     <Navbar.Link active href="/home">
    //       <p>Home</p>
    //     </Navbar.Link>
    //     <Navbar.Link href="/order">Orders</Navbar.Link>
    //     <Navbar.Link href="/calendar">Calendar</Navbar.Link>
    //     <Navbar.Link href="#">Warrenties</Navbar.Link>
    //     <Navbar.Link href="#">Contact</Navbar.Link>
    //   </Navbar.Collapse>
    // </Navbar>
    <header className="flex flex-col">
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900 dark:border-gray-800 order-1 border-b">
        <div className="flex justify-between items-center">
          <div className="flex flex-shrink-0 justify-start items-center">
            <a href="/" className="flex mr-6">
              {/* <img src="https://flowbite.s3.amazonaws.com/logo.svg" className="mr-3 h-8" alt="FlowBite Logo" /> */}
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Valorem</span>
            </a>
          </div>

          <ul className="hidden flex-col justify-center mt-0 w-full text-sm font-medium text-gray-500 md:flex-row dark:text-gray-400 md:flex">
            <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
              <a href="/" className="block py-3 px-4 rounded-lg hover:text-gray-900 dark:hover:text-white">
                Home
              </a>
            </li>
            <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
              <a href="/order" className="block py-3 px-4 rounded-lg hover:text-gray-900 dark:hover:text-white">
                Orders
              </a>
            </li>
            <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
              <a href="/calendar" className="block py-3 px-4 rounded-lg hover:text-gray-900 dark:hover:text-white">
                Calendar
              </a>
            </li>
            <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
              <a href="/warrenties" className="block py-3 px-4 rounded-lg hover:text-gray-900 dark:hover:text-white">
                Warrenties
              </a>
            </li>
          </ul>

          <div className="flex flex-shrink-0 justify-between items-center ml-4 lg:order-2">
            {user ? (
              <Dropdown inline label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}>
                <Dropdown.Header>
                  <span className="block text-sm">Blake Cross</span>
                  <span className="block truncate text-sm font-medium">{user?.email}</span>
                </Dropdown.Header>
                <Dropdown.Item>Dashboard</Dropdown.Item>
                <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                <Dropdown.Item>Earnings</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={SignOut}>Sign out</Dropdown.Item>
              </Dropdown>
            ) : (
              <Button href="/login">Login</Button>
            )}
            {/* <button
              type="button"
              className="flex mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded="false"
              data-dropdown-toggle="dropdown"
            >
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
            </button> */}
            {/* <!-- Dropdown menu --> */}

            <button
              type="button"
              id="toggleMobileMenuButton"
              data-collapse-toggle="toggleMobileMenu"
              className="items-center p-2 text-gray-500 rounded-lg md:ml-2 md:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open menu</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
