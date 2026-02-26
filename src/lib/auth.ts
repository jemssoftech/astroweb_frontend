import Cookies from "js-cookie";

export const getAuthToken = () => {
  return Cookies.get("accessToken");
};

export const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};

export const getUser = () => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};
