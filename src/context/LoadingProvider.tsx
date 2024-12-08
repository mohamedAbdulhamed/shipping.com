import React from "react";
import Loading from "../components/layout/Loading.tsx";
import { Box } from "@mui/material";
import { toast } from "react-toastify";

type LoadingContextType = {
  mainLoading: boolean;
  setMainLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const LoadingContext = React.createContext<LoadingContextType>({
  mainLoading: false,
  setMainLoading: () => {},
});

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [mainLoading, setMainLoading] = React.useState(false);

  // React.useEffect(() => {
  //   let timeout: NodeJS.Timeout | null = null;

  //   // If mainLoading is true, start the timeout
  //   const TIMEOUT_DURATION = 30_000; // 30 seconds timeout
  //   if (mainLoading) {
  //     timeout = setTimeout(() => {
  //       if (mainLoading){
  //         setMainLoading(false);
  //         toast.error("Timeout")
  //       }
  //     }, TIMEOUT_DURATION);
  //   }

  //   // Cleanup the timeout if mainLoading changes or component unmounts
  //   return () => {
  //     if (timeout) {
  //       clearTimeout(timeout);
  //     }
  //   };
  // }, [mainLoading]);

  return (
    <LoadingContext.Provider value={{ mainLoading, setMainLoading }}>
      {mainLoading && (
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#00000078",
            zIndex: "9999",
          }}
        >
          <Loading />
        </Box>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext;
