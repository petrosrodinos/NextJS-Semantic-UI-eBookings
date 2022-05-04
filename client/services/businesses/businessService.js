import axios from "axios";

const createBusiness = async (userData) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}business`,
    userData,
    { headers: { "Content-Type": "application/json" } }
  );

  return data.message;
};

const fetchBusinesses = async () => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}business`
  );
  return data.businesses;
};

const fetchBusiness = async (id) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}business/${id}`
  );
  return data.business;
};

const businessService = {
  createBusiness,
  fetchBusinesses,
  fetchBusiness,
};

export default businessService;
