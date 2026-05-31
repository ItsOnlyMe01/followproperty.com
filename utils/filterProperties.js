import propertiesData from "@/data/mock/properties";

export const filterProperties = (customFilters) => {
  if (typeof window === "undefined") return propertiesData;

  let filters = customFilters;
  if (!filters) {
    const filtersString = sessionStorage.getItem("watchlistFilters");
    if (!filtersString) return propertiesData;

    try {
      filters = JSON.parse(filtersString);
    } catch (error) {
      console.error("Error parsing filters from sessionStorage", error);
      return propertiesData;
    }
  }

  try {
    
    return propertiesData.filter((property) => {
      let match = true;

      // Match mainCategory (case insensitive)
      if (
        filters.mainCategory &&
        property.mainCategory?.toLowerCase() !== filters.mainCategory.toLowerCase()
      ) {
        match = false;
      }

      // Match specificType
      if (
        filters.specificType &&
        property.specificType?.toLowerCase() !== filters.specificType.toLowerCase()
      ) {
        match = false;
      }

      // Match city
      if (
        filters.city &&
        property.city?.toLowerCase() !== filters.city.toLowerCase()
      ) {
        match = false;
      }

      // Match locality (partial match, case insensitive)
      if (
        filters.locality &&
        !property.locality?.toLowerCase().includes(filters.locality.toLowerCase())
      ) {
        match = false;
      }

      // Match budget (property price should be <= budget)
      if (filters.budget) {
        const budgetValue = Number(filters.budget);
        if (!isNaN(budgetValue) && property.price > budgetValue) {
          match = false;
        }
      }

      return match;
    });
  } catch (error) {
    console.error("Error parsing filters from sessionStorage", error);
    return propertiesData;
  }
};
