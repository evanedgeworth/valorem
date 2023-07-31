"use client";
import classNames from "classnames";
import { Sidebar as FlowbiteSidebar } from "flowbite-react";
import type { FC, PropsWithChildren } from "react";
import { useSidebarContext } from "../context/SidebarContext";
import { BiBuoy, BiBriefcaseAlt } from "react-icons/bi";
import { BsBriefcase } from "react-icons/bs";
import {
  HiAdjustments,
  HiArrowNarrowRight,
  HiArrowSmRight,
  HiChartPie,
  HiOutlineCalendar,
  HiInbox,
  HiOutlineAdjustments,
  HiShoppingBag,
  HiTable,
  HiUser,
  HiUserCircle,
  HiViewBoards,
  HiX,
} from "react-icons/hi";
import { RiFilePaper2Line } from "react-icons/ri";

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
          <FlowbiteSidebar.Item href="/orders" icon={BiBriefcaseAlt}>
            Orders
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="/calendar" icon={HiOutlineCalendar}>
            Calendar
          </FlowbiteSidebar.Item>
          <FlowbiteSidebar.Item href="#" icon={RiFilePaper2Line}>
            Warrenties
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
        <FlowbiteSidebar.ItemGroup>
          <FlowbiteSidebar.Item href="#" icon={BiBuoy}>
            Help
          </FlowbiteSidebar.Item>
        </FlowbiteSidebar.ItemGroup>
      </FlowbiteSidebar.Items>
    </FlowbiteSidebar>
  );
}
