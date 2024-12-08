import React, { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth.ts";
import { ROLES } from "../../config/constants.ts";

type RequireAuthProps = {
  allowedRoles: (typeof ROLES)[keyof typeof ROLES][];
}

const RequireAuth = ({ allowedRoles }: RequireAuthProps) => {
    const { auth } = useAuth();
    const location = useLocation();

    const validateRole = () => {
      const validRoles = new Set(Object.values(allowedRoles));
      return !!auth?.user?.role && validRoles.has(auth.user.role);
    };

    return (
      validateRole()
        ? <Outlet />
        : auth?.user
          ? <Navigate to="/unauthorized" state={{ from: location }} replace />
          : <Navigate to="/login" state={{ from: location }} replace />
    );
}

export default RequireAuth;