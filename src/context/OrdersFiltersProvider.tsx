import React, { createContext, useState } from "react";

// Orders Filters
type OrdersFiltersContextType = {
  pickupCity: string | null;
  setPickupCity: (city: string | null) => void;
  deliveryCity: string | null;
  setDeliveryCity: (city: string | null) => void;
  isFragile: boolean | null;
  setIsFragile: (isFragile: boolean | null) => void;
  weight: number | null;
  setWeight: (weight: number | null) => void;
  sortBy: string | null;
  setSortBy: (sortBy: string | null) => void;
  sortDescending: boolean;
  setSortDescending: (sortDescending: boolean) => void;
  clearFilters: () => void;
};

const OrdersFiltersContext = createContext<OrdersFiltersContextType>({
    pickupCity: null,
    deliveryCity: null,
    isFragile: null,
    weight: null,
    sortBy: null,
    sortDescending: false,
    setPickupCity: () => {},
    setDeliveryCity: () => {},
    setIsFragile: () => {},
    setWeight: () => {},
    setSortBy: () => {},
    setSortDescending: () => {},
    clearFilters: () => {},
});

export const OrdersFiltersProvider = ({ children }: { children: React.ReactNode }) => {
  const [pickupCity, setPickupCity] = useState<OrdersFiltersContextType['pickupCity']>(null);
  const [deliveryCity, setDeliveryCity] = useState<OrdersFiltersContextType['deliveryCity']>(null);
  const [isFragile, setIsFragile] = useState<OrdersFiltersContextType['isFragile']>(null);
  const [weight, setWeight] = useState<OrdersFiltersContextType['weight']>(null);
  const [sortBy, setSortBy] = useState<OrdersFiltersContextType['sortBy']>(null);
  const [sortDescending, setSortDescending] = useState<OrdersFiltersContextType['sortDescending']>(false);
 

  const clearFilters = () => {
    setPickupCity(null);
    setDeliveryCity(null);
    setIsFragile(null);
    setWeight(null);
    setSortBy(null);
    setSortDescending(false);
  };

  return (
    <OrdersFiltersContext.Provider
      value={{
        pickupCity,
        setPickupCity,
        deliveryCity,
        setDeliveryCity,
        isFragile,
        setIsFragile,
        weight,
        setWeight,
        sortBy,
        setSortBy,
        sortDescending,
        setSortDescending,
        clearFilters,
      }}
    >
      {children}
    </OrdersFiltersContext.Provider>
  );
};

export default OrdersFiltersContext;
