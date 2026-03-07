import Cookies from "js-cookie";

export const getAuthToken = () => {
  return (
    Cookies.get("accessToken") ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : null) ||
    (typeof window !== "undefined" ? localStorage.getItem("AuthToken") : null)
  );
};

export const getRefreshToken = () => {
  return Cookies.get("refreshToken");
};

export interface User {
  id?: string;
  userName?: string;
  userEmail?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

let cachedUserString: string | null = null;
let cachedUser: User | null = null;

export const getUser = (): User | null => {
  if (typeof window !== "undefined") {
    const userString = localStorage.getItem("user");
    if (userString !== cachedUserString) {
      cachedUserString = userString;
      cachedUser = userString ? JSON.parse(userString) : null;
    }
    return cachedUser;
  }
  return null;
};

export const logout = () => {
  Cookies.remove("accessToken");
  Cookies.remove("refreshToken");
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("AuthToken");
    window.location.href = "/login";
  }
};
