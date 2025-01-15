"use client";

import { useContext, useEffect, useState } from "react";
import { Dropdown, Navbar, Avatar, Button, Spinner, DarkThemeToggle } from "flowbite-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import Valorem from "../../public/valorem.svg";
import Image from "next/image";
import Link from "next/link";
import { NotificationIcon } from "./icon";
import { IoIosArrowDown } from "react-icons/io";

export default function NavbarWithDropdown() {
  const router = useRouter();
  const { user, selectedOrganization, setSelectedOrganization, allOrganizations, signOut } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  async function handleSignOut() {
    signOut();
  }

  return (
    <header className="flex flex-col">
      <nav className="px-4 lg:px-6 py-2.5 bg-gray-800 border-gray-700 order-1 border-b">
        <div className="flex justify-between items-center">
          <div className="flex flex-shrink-0 justify-start items-center">
            <Link href="/" className="flex mr-6">
              <Image alt="Valorem logo" height="40" src={Valorem} width="40" />
            </Link>
          </div>
          <div className="flex flex-shrink-0 justify-between items-center ml-4 lg:order-2">
            {isLoading ? (
              <Spinner />
            ) : user?.id ? (
              <>
                <ul className="hidden flex-col justify-center mt-0 w-full text-sm font-medium text-gray-500 md:flex-row dark:text-gray-400 md:flex items-center">
                  {allOrganizations && allOrganizations.length > 0 && (
                    <li className="block md:inline md:border-b-0">
                      <div className="block px-3 rounded-lg  cursor-pointer">
                        <Dropdown
                          inline
                          label=""
                          placement="bottom"
                          renderTrigger={() => (
                            <div className="px-4 py-2 border-[#C3DDFD] border-2 rounded-lg text-white flex gap-2 items-center">
                              {selectedOrganization?.name}
                              <IoIosArrowDown />
                            </div>
                          )}
                          size={"sm"}
                        >
                          <Dropdown.Header>
                            <span className="flex justify-center">Organizations</span>
                          </Dropdown.Header>
                          {allOrganizations.length > 0 &&
                            allOrganizations.map((org) => (
                              <Dropdown.Item onClick={() => setSelectedOrganization(org)} key={org.organizationId}>
                                {org.name}
                              </Dropdown.Item>
                            ))}
                        </Dropdown>
                      </div>
                    </li>
                  )}

                  <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
                    <div className="block py-3 px-3 rounded-lg  cursor-pointer">
                      <Dropdown
                        inline
                        label=""
                        placement="bottom"
                        renderTrigger={() => (
                          <span className="text-gray-400 hover:text-gray-200">
                            <NotificationIcon />
                          </span>
                        )}
                        size={"sm"}
                      >
                        <Dropdown.Header>
                          <span className="flex justify-center">Notifications</span>
                        </Dropdown.Header>
                        <Dropdown.Item onClick={() => router.push("/notifications")}>
                          <strong>Josh H.</strong>&nbsp;has declined the change order
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>
                          <strong>Land Excavation</strong>&nbsp;has been successfully created
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>
                          <strong>Project 568</strong>&nbsp;has been successfully created
                        </Dropdown.Item>
                      </Dropdown>
                    </div>
                    {/* <Dropdown label="awf" inline dismissOnClick={false} renderTrigger={() => <MdNotificationsNone size={30} />}>
                      <Dropdown.Item>Notification 1</Dropdown.Item>
                      <Dropdown.Item>Notification 2</Dropdown.Item>
                      <Dropdown.Item>Notification 3</Dropdown.Item>
                    </Dropdown> */}
                  </li>
                </ul>

                <div className="pl-2">
                  <Dropdown inline label={<Avatar style={{ minWidth: 32 }} img={user?.profileImage?.fileUrl} alt="User settings" rounded size="sm" />}>
                    <Dropdown.Header>
                      {/* <span className="block text-sm">{user.first_name + " " + user.last_name}</span> */}
                      <span className="block truncate text-sm font-medium text-white">{user.email}</span>
                    </Dropdown.Header>
                    <Dropdown.Item href="/settings">Settings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                  </Dropdown>
                </div>
              </>
            ) : (
              <Button href="/login">Login</Button>
            )}

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
