import axios from "axios";

const register = async (userData) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}user/register`,
    userData,
    { headers: { "Content-Type": "application/json" } }
  );

  if (data) {
    localStorage.setItem("user", JSON.stringify(data));
  }

  return data;
};

const login = async (userData) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}user/login`,
    userData,
    { headers: { "Content-Type": "application/json" } }
  );

  // if (data) {
  //   localStorage.setItem("user", JSON.stringify(data));
  // }
  return data;
};

const authService = {
  register,
  login,
};

export default authService;
