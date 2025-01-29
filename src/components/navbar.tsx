"use client";

import { useContext, useEffect, useState } from "react";
import { Dropdown, Navbar, Avatar, Button, Spinner } from "flowbite-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import Valorem from "../../public/valorem.svg";
import Image from "next/image";
import Link from "next/link";
import Notifications from "./notifications";
import Cookies from "js-cookie";
import { localStorageKey } from "@/utils/useLocalStorage";

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
      <nav className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-900 dark:border-gray-800 order-1 border-b">
        <div className="flex justify-between items-center">
          <div className="flex flex-shrink-0 justify-start items-center">
            <Link href="/" className="flex mr-6">
              <Image alt="Valorem logo" height="40" src={Valorem} width="40" className="invert dark:filter-none" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Valorem</span>
            </Link>
          </div>
          <div className="flex flex-shrink-0 justify-between items-center ml-4 lg:order-2">
            {isLoading ? (
              <div className="h-[50px] flex items-center">
                <Spinner />
              </div>
            ) : user?.id ? (
              <>
                <ul className="hidden flex-col justify-center mt-0 w-full text-sm font-medium text-gray-500 md:flex-row dark:text-gray-400 md:flex items-center">
                  {allOrganizations && allOrganizations.length > 0 && (
                    <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
                      <div className="block px-3 rounded-lg hover:text-gray-900 dark:hover:text-white cursor-pointer">
                        <Dropdown
                          inline
                          label=""
                          placement="bottom"
                          renderTrigger={() => (
                            <span>
                              <Button pill color="gray">
                                {selectedOrganization?.name}
                              </Button>
                            </span>
                          )}
                          size={"sm"}
                        >
                          <Dropdown.Header>
                            <span className="flex justify-center">Organizations</span>
                          </Dropdown.Header>
                          {allOrganizations.length > 1 &&
                            allOrganizations.map((org) => (
                              <Dropdown.Item onClick={() => {
                                setSelectedOrganization(org);
                                Cookies.set(localStorageKey.roleId, org.roleId);
                              }} key={org.organizationId}>
                                {org.name}
                              </Dropdown.Item>
                            ))}
                        </Dropdown>
                      </div>
                    </li>
                  )}

                  <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
                    <div className="block py-3 px-3 rounded-lg  cursor-pointer">
                      <Notifications />
                    </div>
                  </li>
                </ul>

                <div className="pl-2">
                  <Dropdown inline label={<Avatar style={{ minWidth: 32 }} img={user?.profileImage?.fileUrl} alt="User settings" rounded size="sm" />}>
                    <Dropdown.Header>
                      {/* <span className="block text-sm">{user.first_name + " " + user.last_name}</span> */}
                      <span className="block truncate text-sm font-medium ">{user.email}</span>
                    </Dropdown.Header>
                    <Dropdown.Item as={Link} href="/settings">Settings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                  </Dropdown>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button>Login</Button>
              </Link>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}
