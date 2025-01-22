"use client";

import { useContext, useEffect, useState } from "react";
import { Dropdown, Navbar, Avatar, Button, Spinner, DarkThemeToggle } from "flowbite-react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import Valorem from "../../public/valorem.svg";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowDown } from "react-icons/io";
import classNames from "classnames";
import Notifications from "./notifications";

export default function NavbarWithDropdown({ isMain }: { isMain?: boolean }) {
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
      <nav className={classNames({
        "px-4 lg:px-6 py-2.5 order-1 border-b": true,
        "bg-gray-800 border-gray-700": !isMain,
        "bg-black border-black": isMain,
      })}>
        <div className="flex justify-between items-center">
          <div className="flex flex-shrink-0 justify-start items-center">
            <Link href="/" className="flex mr-6">
              <Image alt="Valorem logo" height="40" src={Valorem} width="40" />
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
                      <Notifications />
                    </div>
                  </li>
                </ul>

                <div className="pl-2">
                  <Dropdown inline label={<Avatar style={{ minWidth: 32 }} img={user?.profileImage?.fileUrl} alt="User settings" rounded size="sm" />}>
                    <Dropdown.Header>
                      {/* <span className="block text-sm">{user.first_name + " " + user.last_name}</span> */}
                      <span className="block truncate text-sm font-medium text-white">{user.email}</span>
                    </Dropdown.Header>
                    <Dropdown.Item as={Link} href="/settings">Settings</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleSignOut}>Sign out</Dropdown.Item>
                  </Dropdown>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button color="primary">Login</Button>
              </Link>
            )}

          </div>
        </div>
      </nav>
    </header>
  );
}
