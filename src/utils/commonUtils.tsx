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
