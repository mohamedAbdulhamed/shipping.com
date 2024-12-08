import useAxiosPrivate from "./useAxiosPrivate.ts";
import useAuth from "./useAuth.ts";

const useLogout = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setAuth } = useAuth();

  const logout = async () => {
    try {
      const response = await axiosPrivate.get("/Account/logout");

      if (
        response?.data?.Success === true &&
        response?.data?.StatusCode === 200
      ) {
        setAuth({
          token: null,
          user: null,
        });
        return { success: true, message: "Logged out successfully." };
      } else {
        const errorMessage =
          response?.data?.ErrorMessage || "Couldn't log you out.";
        console.error(errorMessage);
        return { success: false, message: errorMessage };
      }
    } catch (error) {
      console.error(error);
      return { success: false, message: "An error occurred during logout." };
    }
  };

  return logout;
};

export default useLogout;
