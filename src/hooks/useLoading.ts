import { useContext } from "react";
import LoadingContext from "../context/LoadingProvider.tsx";

const useLoading = () => {
  return useContext(LoadingContext);
};

export default useLoading;
