"use client";
import { Avatar, Button, Checkbox, Label, TextInput } from "flowbite-react";
import type { FC } from "react";

const LoginFormWithDescription: FC = function () {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="grid lg:h-screen lg:grid-cols-2">
        <div className="flex items-center justify-center px-4 py-6 sm:px-0 lg:py-0">
          <form
            className="w-full max-w-md space-y-4 md:space-y-6 xl:max-w-xl"
            action="#"
          >
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h1>

            <div>
              <Label htmlFor="email">Email</Label>
              <TextInput
                id="email"
                placeholder="Enter your email"
                required
                type="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <TextInput
                id="password"
                placeholder="••••••••"
                required
                type="password"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <Checkbox id="remember" required />
                </div>
                <div className="ml-3 text-sm">
                  <Label htmlFor="remember">Remember me</Label>
                </div>
              </div>
              <a
                href="#"
                className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Forgot password?
              </a>
            </div>
            <Button type="submit" className="w-full">
              Sign in to your account
            </Button>
            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
              >
                Sign up
              </a>
            </p>
          </form>
        </div>
        <div className="flex items-center justify-center bg-primary-600 px-4 py-6 sm:px-0 lg:py-0">
          <div className="max-w-md xl:max-w-xl">
            <a
              href="#"
              className="mb-4 flex items-center text-2xl font-semibold text-white"
            >
              <img
                className="mr-2 h-8 w-8"
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
                alt="logo"
              />
              Flowbite
            </a>
            <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-white xl:text-5xl">
              Explore the world’s leading design portfolios.
            </h1>
            <p className="mb-4 font-light text-primary-200 lg:mb-8">
              Millions of designers and agencies around the world showcase their
              portfolio work on Flowbite - the home to the world’s best design
              and creative professionals.
            </p>
            <div className="flex items-center divide-x divide-primary-500">
              <Avatar.Group>
                <Avatar
                  alt="bonnie avatar"
                  img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                  rounded
                  stacked
                />
                <Avatar
                  alt="jese avatar"
                  img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                  rounded
                  stacked
                />
                <Avatar
                  alt="roberta avatar"
                  img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/roberta-casas.png"
                  rounded
                  stacked
                />
                <Avatar
                  alt="thomas avatar"
                  img="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/thomas-lean.png"
                  rounded
                  stacked
                />
              </Avatar.Group>
              <a href="#" className="pl-3 text-white dark:text-white sm:pl-5">
                <span className="text-sm text-primary-200">
                  Over <span className="font-medium text-white">15.7k</span>{" "}
                  Happy Customers
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginFormWithDescription;
