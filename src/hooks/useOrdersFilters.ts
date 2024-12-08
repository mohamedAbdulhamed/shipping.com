import { useContext } from "react";
import OrdersFiltersContext from "../context/OrdersFiltersProvider.tsx";

const useOrdersFilters = () => {
  return useContext(OrdersFiltersContext);
};

export default useOrdersFilters;
