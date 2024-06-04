import { Database } from "../../types/supabase";
type Item = Database["public"]["Tables"]["line_items"]["Row"];
type Product = Database["public"]["Tables"]["order_items"]["Row"] & {
  item_id: Item;
  status?: string;
};
interface COProduct extends Product {
  status: string;
}
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function MergeProductsbyKey(array: Product[], key: keyof Product) {
  const arrays: Array<Product[]> = [];

  array.forEach((obj: any) => {
    let added = false;
    for (const array of arrays) {
      if (array.length > 0 && obj[key] === array[0][key]) {
        array.push(obj);
        added = true;
        break;
      }
    }
    if (!added) {
      arrays.push([obj]);
    }
  });

  return arrays;
}

export function MergeOrdersbyKey(array: any, key: string) {
  const arrays: any = [];

  array.forEach((obj: any) => {
    let added = false;
    for (const subArray of arrays) {
      if (subArray.length > 0 && obj[key] === subArray[0][key]) {
        subArray.push(obj);
        // Sort the array by "created_at" after pushing the new object
        subArray.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        added = true;
        break;
      }
    }
    if (!added) {
      arrays.push([obj]);
    }
  });

  return arrays;
}

export function arraysEqual(a: any, b: any) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function calcCrow(latitude_1: number, longitude_1: number, latitude_2: number, longitude_2: number) {
  var R = 6371; // km
  var dLat = toRad(latitude_2 - latitude_1);
  var dLon = toRad(longitude_2 - longitude_1);
  var lat1 = toRad(latitude_1);
  var lat2 = toRad(latitude_2);

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Converts numeric degrees to radians
function toRad(Value: number) {
  return (Value * Math.PI) / 180;
}

// Adds commas to numbers
export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// export function calculateTotalPrice(products: Product[], property: "retail_price" | "price") {
//   let totalCost = 0;

//   // Iterate through the array
//   for (let i = 0; i < products.length; i++) {
//     // Multiply quantity by price for each item and add to totalCost
//     totalCost += products[i].Qty * products[i][property]!;
//   }

//   return totalCost;
// }

export function calculateTotalPrice(products: Product[], property: "retail_price" | "price") {
  let totalCost = 0;

  // Iterate through the array
  for (let i = 0; i < products.length; i++) {
    // Multiply quantity by price for each item and add to totalCost
    totalCost += products[i].quantity * products[i]["price"]!;
  }
  return totalCost;
}

// export function compareArrays(previousProducts: Product[], currentProducts: Product[]) {
//   const newArray: COProduct[] = [];

//   // Find new items
//   currentProducts.forEach((item2) => {
//     if (!previousProducts.some((item1) => item1.description === item2.description)) {
//       newArray.push({ ...item2, status: "new" });
//       // Find items with updated price
//     } else if (previousProducts.some((item1) => item1.description === item2.description && item2.price !== item1.price)) {
//       newArray.push({ ...item2, status: "updated" });
//     } else if (previousProducts.some((item1) => item1.description === item2.description && item2.quantity !== item1.quantity)) {
//       newArray.push({ ...item2, status: "updated" });
//     } else {
//       newArray.push({ ...item2, status: "" });
//     }
//   });

//   // Find removed items
//   previousProducts.forEach((item1) => {
//     if (!currentProducts.some((item2) => item2.description === item1.description)) {
//       newArray.push({ ...item1, status: "removed" });
//     }
//   });

//   return newArray;
// }

export function compareArrays(previousProducts: Product[], currentProducts: Product[]) {
  const newArray: COProduct[] = [];

  // Find new items
  currentProducts.forEach((item2) => {
    const matchingItem = previousProducts.find((item1) => item1.item_id.id === item2.item_id.id && item1.room === item2.room);
    if (!matchingItem) {
      newArray.push({ ...item2, status: "new" });
      // Find items with updated price
    } else if (matchingItem.price !== item2.price || matchingItem.quantity !== item2.quantity) {
      newArray.push({ ...item2, status: "updated" });
    } else {
      newArray.push({ ...item2, status: "" });
    }
  });

  // Find removed items
  previousProducts.forEach((item1) => {
    const matchingItem = currentProducts.find((item2) => item1.item_id.id === item2.item_id.id && item1.room === item2.room);
    if (!matchingItem) {
      newArray.push({ ...item1, status: "removed" });
    }
  });

  return newArray;
}

export function formatToUSD(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-US");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sortOrderTable(a: Product[], b: Product[]) {
  return (a[0].room || "").localeCompare(b[0].room || "");
}
