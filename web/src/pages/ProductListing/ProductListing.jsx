import React, { Suspense } from "react";

import "./ProductListing.css";

// import components with React.lazy
const Filter = React.lazy(async () => ({
  default: (await import("./components/Filter/Filter")).Filter
}));
const ProductListingSection = React.lazy(async () => ({
  default: (await import("./components/ProductListingSection/ProductListingSection")).ProductListingSection
}));

const LoadingFallback = () => (
  <div className="loading-spinner">Loading...</div>
);

export const ProductListing = () => {
  return (
    <div className="page-container">
      <Suspense fallback={<LoadingFallback />}>
        <Filter className="filters" />
        <ProductListingSection className="products-container" />
      </Suspense>
    </div>
  );
};

