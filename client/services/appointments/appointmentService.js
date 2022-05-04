import axios from "axios";

const fetchAppointments = async (type, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}appointment?type=${type}`,
    config
  );

  return response.data.message;
};

const fetchTodaysAppointments = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}appointment/today`,
    config
  );

  return response.data.message;
};

const createAppointment = async (appointment, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}appointment`,
    appointment,
    config
  );
  return response.data.message;
};

const changeAppointmentStatus = async (appointment, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL_TEST}appointment/${appointment.id}`,
    { status: appointment.status, role: appointment.role },
    config
  );
  return response.data.message;
};

const appointmentService = {
  fetchAppointments,
  createAppointment,
  changeAppointmentStatus,
  fetchTodaysAppointments,
};

export default appointmentService;
