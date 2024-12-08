import React from "react";
import { Outlet, useNavigate } from "react-router-dom";

import useRefreshToken from '../../hooks/useRefreshToken.ts';
import useAuth from "../../hooks/useAuth.ts";
import useLoading from "../../hooks/useLoading.ts";

import { toast } from "react-toastify";

const PersistLogin = ({ suppressErrors = false, silently = false }: { suppressErrors?: boolean, silently?: boolean }) => {
  const navigate = useNavigate();
  const refresh = useRefreshToken();
  const { setMainLoading } = useLoading(); // for visuals
  const { auth, persist } = useAuth();

  const [isLoading, setIsLoading] = React.useState(false); // for logic

  React.useEffect(() => {
    let isMounted = true;

    const verifyRefreshToken = async () => {
      !silently && setMainLoading(true);
      
      try {
        await refresh();
      } catch (err) {
        if (!suppressErrors) {
          // Redirect On Failure
          toast.error("We're unable to refresh your session. Please sign in again.");
          navigate('/login');
        }
      } finally {
        isMounted && setIsLoading(false);
        setMainLoading(false);
      }
    };

    !auth?.token ? verifyRefreshToken() : setIsLoading(false);

    return () => {
      isMounted = false;
    };
  }, [setMainLoading]); // warning: providing auth.token or the refresh function as a dependency will result in a looped cycle!

  return (
    <>
      {!persist
        ? <Outlet />
        : !isLoading && <Outlet />
      }
    </>
  );
}

export default PersistLogin;
