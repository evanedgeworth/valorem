"use client";
import { DarkThemeToggle, Navbar, Dropdown, Avatar } from "flowbite-react";
import Image from "next/image";
import { FC } from "react";
import Valorem from "../../public/valorem.svg";

const Header: FC<Record<string, never>> = function () {
  return (
    <header className="sticky top-0 z-20">
      <Navbar fluid>
        <Navbar.Brand href="/">
          <Image alt="Valorem logo" height="24" src={Valorem} width="24" />
          <Valorem />
          <span className="self-center whitespace-nowrap px-3 text-xl font-semibold dark:text-white">Valorem</span>
        </Navbar.Brand>
        <div className="flex md:order-2">
          <Navbar.Toggle />
          {/* <DarkThemeToggle /> */}
          <Dropdown inline label={<Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />}>
            <Dropdown.Header>
              <span className="block text-sm">Bonnie Green</span>
              <span className="block truncate text-sm font-medium">name@flowbite.com</span>
            </Dropdown.Header>
            <Dropdown.Item>Dashboard</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <Dropdown.Item>Earnings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item>Sign out</Dropdown.Item>
          </Dropdown>
        </div>
        {/* <Navbar.Collapse>
          <Navbar.Link href="/" active>
            Home
          </Navbar.Link>
          <Navbar.Link href="/">About</Navbar.Link>
          <Navbar.Link href="/">Services</Navbar.Link>
          <Navbar.Link href="/">Pricing</Navbar.Link>
          <Navbar.Link href="/">Contact</Navbar.Link>
        </Navbar.Collapse> */}
      </Navbar>
    </header>
  );
};

export default Header;
