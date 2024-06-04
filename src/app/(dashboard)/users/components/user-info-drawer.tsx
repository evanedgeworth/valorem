import { cn } from "@/utils/commonUtils";
import { Database } from "../../../../../types/supabase";
import { Avatar } from "flowbite-react";
type User = Database["public"]["Tables"]["profiles"]["Row"] & { user_organizations: User_Organizations[] };
type User_Organizations = Database["public"]["Tables"]["user_organizations"]["Row"];

export default function UserInfoDrawer({
  showDrawer,
  setShowDrawer,
  user,
}: {
  showDrawer: boolean;
  setShowDrawer: (value: boolean) => void;
  user?: User;
}) {
  return (
    <>
      <div
        id="drawer-update-product-default"
        className={cn(
          "fixed top-0 right-0 z-40 w-full h-full max-w-xs p-4 overflow-y-auto transition-transform translate-x-full bg-white dark:bg-gray-800",
          showDrawer && " translate-x-0"
        )}
        aria-labelledby="drawer-label"
        aria-hidden="true"
      >
        <h5 id="drawer-label" className="inline-flex items-center mb-6 text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">
          User Info
        </h5>
        <button
          type="button"
          data-drawer-dismiss="drawer-update-product-default"
          aria-controls="drawer-update-product-default"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={() => setShowDrawer(false)}
        >
          <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
          <span className="sr-only">Close menu</span>
        </button>
        <div className="space-y-4">
          <div className=" text-left">
            <Avatar alt="User settings" rounded size="lg" className=" justify-start" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <div>
              <p className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">First Name</p>
              <p className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{user?.first_name}</p>
            </div>
            <div>
              <p className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Last Name</p>
              <p className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{user?.last_name}</p>
            </div>
          </div>
          <div>
            <p className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Phone</p>
            <p className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{user?.phone}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Email</p>
            <p className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{user?.email}</p>
          </div>
          <div>
            <p className="mb-2 font-semibold leading-none text-gray-900 dark:text-white">Markets</p>
            <p className="mb-4 font-light text-gray-500 sm:mb-5 dark:text-gray-400">{user?.markets?.join(", ")}</p>
          </div>
        </div>
      </div>
      <div
        className={cn("bg-gray-900 bg-opacity-50 fixed inset-0 z-30 transition-opacity", !showDrawer && "bg-opacity-0 -z-10")}
        onClick={() => setShowDrawer(false)}
      />
    </>
  );
}
