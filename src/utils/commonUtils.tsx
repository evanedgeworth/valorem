export function MergeProductsbyKey(array: any, key: string) {
  const arrays: any = [];

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
  console.log(arrays);
  return arrays;
}
