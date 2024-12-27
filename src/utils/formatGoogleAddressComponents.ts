export default function formatGoogleAddressComponents(data: any) {
  let streetNumber = "";
  let route = "";
  let locality = "";
  let administrativeAreaLevel2 = "";
  let administrativeAreaLevel1 = "";
  let postalCode = "";
  let postalCodeSuffix = "";
  let subpremise = "";

  data.address_components.forEach((component: any) => {
    if (component.types.includes("street_number")) {
      streetNumber = component.long_name;
    } else if (component.types.includes("route")) {
      route = component.long_name;
    } else if (component.types.includes("locality")) {
      locality = component.long_name;
    } else if (component.types.includes("administrative_area_level_2")) {
      administrativeAreaLevel2 = component.long_name;
    } else if (component.types.includes("administrative_area_level_1")) {
      administrativeAreaLevel1 = component.short_name;
    } else if (component.types.includes("postal_code")) {
      postalCode = component.long_name;
    } else if (component.types.includes("postal_code_suffix")) {
      postalCodeSuffix = component.long_name;
    } else if (component.types.includes("subpremise")) {
      subpremise = component.long_name;
    }
  });

  // Combine postal code and suffix if applicable
  const fullPostalCode = postalCodeSuffix ? `${postalCode}-${postalCodeSuffix}` : postalCode;

  return {
    addressLine1: streetNumber + " " + route,
    addressLine2: subpremise,
    city: locality,
    state: administrativeAreaLevel1,
    zipCode: fullPostalCode,
  };
}
