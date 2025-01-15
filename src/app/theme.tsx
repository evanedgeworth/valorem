import { type CustomFlowbiteTheme } from "flowbite-react";

export const flowbiteTheme: CustomFlowbiteTheme = {
  footer: {
    root: {
      base: "flex flex-col",
    },
    brand: {
      base: "m-6 flex items-center",
    },
    groupLink: {
      base: "flex flex-col flex-wrap text-gray-500 dark:text-white",
      link: {
        base: "mb-4 last:mr-0 md:mr-6",
      },
    },
    icon: {
      base: "text-gray-400 hover:text-gray-900 dark:hover:text-white",
    },
  },
  modal: {
    body: {
      base: "space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8",
    },
    content: {
      inner: "bg-gray-800 border border-gray-700 rounded-lg",
    },
    header: {
      title: "text-white"
    }
  },
  button: {
    color: {
      primary: "bg-blue-500 hover:bg-red-600",
    },
  },
  sidebar: {
    root: {
      base: "h-full bg-gray-900",
      inner: "h-full overflow-y-auto overflow-x-hidden py-4 px-3 bg-gray-800",
    },
    collapse: {
      list: "space-y-2 py-2 list-none",
    },
    item: {
      base: "no-underline flex items-center rounded-lg p-2 text-lg font-normal text-white hover:bg-gray-900",
      active: "bg-gray-900"
    },
    itemGroup: {
      base: "list-none border-t border-gray-200 pt-3 first:mt-0 first:border-t-0 first:pt-0 dark:border-gray-700",
    },
  },
  table: {
    root: {
      wrapper: "rounded-lg bg-gray-800",
    },
    head: {
      cell: {
        base: "p-4 text-white"
      },
      base: "bg-gray-700 rounded-t-lg"
    },
    body: {
      cell: {
        base: "text-white p-4 bg-gray-800"
      },
    }
  },
  dropdown: {
    floating: {
      style: {
        auto: "bg-gray-700 border-gray-700 rounder-lg"
      },
      item: {
        base: "text-white flex w-full cursor-pointer items-center gap-2 justify-start px-4 py-2 text-sm hover:bg-gray-800 whitespace-nowrap"
      },
      header: "text-white px-4 py-2"
    },
  },
  card: {
    root: {
      base: "bg-gray-800 text-white rounded-lg",
    }
  },
  label: {
    root: {
      colors: {
        default: "text-white"
      }
    },
  },
  textInput: {
    field: {
      input: {
        colors: {
          gray: "bg-gray-700"
        }
      }
    },
  },
  textarea: {
    colors: {
      gray: "bg-gray-700"
    }
  }
};
