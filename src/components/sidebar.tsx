"use client";
import classNames from "classnames";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";
import { useSidebarContext } from "../context/SidebarContext";
import { BiBuoy } from "react-icons/bi";
import {
  BsDribbble,
  BsFacebook,
  BsGithub,
  BsInstagram,
  BsTwitter,
} from "react-icons/bs";
import {
  HiAdjustments,
  HiArrowNarrowRight,
  HiArrowSmRight,
  HiChartPie,
  HiCheck,
  HiClipboardList,
  HiCloudDownload,
  HiDatabase,
  HiExclamation,
  HiEye,
  HiHome,
  HiInbox,
  HiOutlineAdjustments,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiUserCircle,
  HiViewBoards,
  HiX,
} from "react-icons/hi";

const Sidebar: FC<PropsWithChildren<Record<string, unknown>>> = function ({
  children,
}) {
  const { isOpenOnSmallScreens: isSidebarOpenOnSmallScreens } =
    useSidebarContext();

  return (
    <div
      className={classNames(
        "fixed overflow-auto top-0 h-screen z-10 lg:sticky lg:!block",
        {
          hidden: !isSidebarOpenOnSmallScreens,
        }
      )}
    >
      <FlowbiteSidebar>
        <ActualSidebar />
      </FlowbiteSidebar>
    </div>
  );
};

export default Object.assign(Sidebar, { ...FlowbiteSidebar });

function ActualSidebar(): JSX.Element {
  return (
    <FlowbiteSidebar>
      <FlowbiteSidebar.Items>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item href="/orders" icon={HiChartPie}>
            Orders
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/" icon={HiViewBoards}>
            Account
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/calendar" icon={HiInbox}>
            Calendar
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="#" icon={HiUser}>
            Warrenties
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="#" icon={HiShoppingBag}>
            Change Orders
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item href="#" icon={HiChartPie}>
            Upgrade to Pro
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="#" icon={HiViewBoards}>
            Documentation
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="#" icon={BiBuoy}>
            Help
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
