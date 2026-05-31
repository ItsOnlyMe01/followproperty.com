import React from "react";
import PropertyCard from "./PropertyCard";

export default function PropertyGrid({ properties = [] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
