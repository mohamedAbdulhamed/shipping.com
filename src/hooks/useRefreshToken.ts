import axios from "../api/axios.ts";
import useAuth from "./useAuth.ts";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const response = await axios.get('/Account/refresh-token', {
        withCredentials: true,
      });

      if (response?.data?.Success && response?.data?.StatusCode === 200)
      {
        const token = response?.data?.Result?.token;
        const user = response?.data?.Result?.user;

        if (!token || !user) return null;

        setAuth({ user, token });

        return token;
      }
    } catch (err) {
      console.error("Failed to refresh token:", err.response || err);
      // setAuth({user: null, token: null});
      throw err;
    }
    return null;
  }

  return refresh;
}

export default useRefreshToken;
