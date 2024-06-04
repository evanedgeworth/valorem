"use client";
import { useContext, useEffect, useState } from "react";
import { Dropdown, Navbar, Avatar, Button, Spinner } from "flowbite-react";
import { Session, createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "../../types/supabase";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/userContext";
import Valorem from "../../public/valorem.svg";
import Image from "next/image";
import Link from "next/link";
import { BsCalendar } from "react-icons/bs";
import { PiHammer } from "react-icons/pi";
import { MdOutlineCalendarToday, MdNotificationsNone } from "react-icons/md";
import { FiBell } from "react-icons/fi";
import { HiChartPie, HiMiniSquares2X2 } from "react-icons/hi2";
type User = Database["public"]["Tables"]["profiles"]["Row"];

export default function NavbarWithDropdown() {
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();
  const { user, organization, setOrganization, allOrganizations } = useContext(UserContext);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    handleGetSession();
  }, []);

  async function handleGetSession() {
    setIsLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (session) {
      setSession(session);
    }
    setIsLoading(false);
  }

  async function handleSignOut() {
    let { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      setSession(null);
      // handleGetSession();
      // console.log("SESSION HERE", session);
      // router.replace("/");
    }
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
              <Spinner />
            ) : session ? (
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
                                {organization?.name}
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
                              <Dropdown.Item onClick={() => setOrganization(org)} key={org.id}>
                                {org.name}
                              </Dropdown.Item>
                            ))}
                        </Dropdown>
                      </div>
                    </li>
                  )}
                  <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
                    <div className="block py-3 px-3 rounded-lg hover:text-gray-900 dark:hover:text-white cursor-pointer">
                      <Dropdown
                        inline
                        label=""
                        placement="bottom"
                        renderTrigger={() => (
                          <span>
                            <HiMiniSquares2X2 size={22} />
                          </span>
                        )}
                        size={"sm"}
                      >
                        <Dropdown.Header>
                          <span className="flex justify-center">Apps</span>
                        </Dropdown.Header>
                        <div className="grid grid-cols-3 gap-4 p-4">
                          <Link href="/dashboard" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                            <HiChartPie className="mx-auto mb-2 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400" />
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Dashboard</div>
                          </Link>
                          <Link href="/users" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                            <svg
                              className="mx-auto mb-2 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 19"
                            >
                              <path d="M14.5 0A3.987 3.987 0 0 0 11 2.1a4.977 4.977 0 0 1 3.9 5.858A3.989 3.989 0 0 0 14.5 0ZM9 13h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z" />
                              <path d="M5 19h10v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2ZM5 7a5.008 5.008 0 0 1 4-4.9 3.988 3.988 0 1 0-3.9 5.859A4.974 4.974 0 0 1 5 7Zm5 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm5-1h-.424a5.016 5.016 0 0 1-1.942 2.232A6.007 6.007 0 0 1 17 17h2a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5ZM5.424 9H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h2a6.007 6.007 0 0 1 4.366-5.768A5.016 5.016 0 0 1 5.424 9Z" />
                            </svg>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Users</div>
                          </Link>
                          <Link href="/inbox" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                            <svg
                              className="mx-auto mb-2 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 18 18"
                            >
                              <path d="M15.977.783A1 1 0 0 0 15 0H3a1 1 0 0 0-.977.783L.2 9h4.239a2.99 2.99 0 0 1 2.742 1.8 1.977 1.977 0 0 0 3.638 0A2.99 2.99 0 0 1 13.561 9H17.8L15.977.783ZM6 2h6a1 1 0 1 1 0 2H6a1 1 0 0 1 0-2Zm7 5H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Z" />{" "}
                              <path d="M1 18h16a1 1 0 0 0 1-1v-6h-4.439a.99.99 0 0 0-.908.6 3.978 3.978 0 0 1-7.306 0 .99.99 0 0 0-.908-.6H0v6a1 1 0 0 0 1 1Z" />{" "}
                            </svg>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Inbox</div>
                          </Link>
                          <Link href="/settings" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                            <svg
                              className="mx-auto mb-2 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                            </svg>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Profile</div>
                          </Link>
                          <Link href="/settings" className="block p-4 text-center rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 group">
                            <svg
                              className="mx-auto mb-2 w-5 h-5 text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-400"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                            </svg>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Settings</div>
                          </Link>
                        </div>
                      </Dropdown>
                    </div>
                  </li>
                  <li className="block border-b dark:border-gray-700 md:inline md:border-b-0">
                    <div className="block py-3 px-3 rounded-lg hover:text-gray-900 dark:hover:text-white cursor-pointer">
                      <Dropdown
                        inline
                        label=""
                        placement="bottom"
                        renderTrigger={() => (
                          <span>
                            <FiBell size={22} />
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
                  <Dropdown inline label={<Avatar alt="User settings" rounded size="sm" />}>
                    <Dropdown.Header>
                      {/* <span className="block text-sm">{user.first_name + " " + user.last_name}</span> */}
                      <span className="block truncate text-sm font-medium">{session.user.email}</span>
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
