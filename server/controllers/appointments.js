const Appointment = require("../models/appointment");

const createAppointment = async (req, res, next) => {
  try {
    const { date, timeId, businessId, time } = req.body;
    const appointment = new Appointment({
      date: new Date(date).toDateString(),
      timeId,
      businessId,
      clientId: req.userId,
      time,
    });

    await appointment.save();

    return res.status(200).json({ message: "OK" });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "Could not create your appointment" });
  }
};

const fetchAppointments = async (req, res, next) => {
  try {
    const params =
      req.query.type === "user"
        ? { clientId: req.userId }
        : { businessId: req.businessId };

    const populate = req.query.type === "user" ? "businessId" : "clientId";

    const appointments = await Appointment.find(params, "-timeId")
      .sort({ date: "desc" })
      .populate(populate, "name phone -_id");

    return res.status(200).json({ message: appointments });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "Could not find your appointments" });
  }
};

const fetchTodaysAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find(
      {
        businessId: req.businessId,
        date: new Date().toDateString(),
      },
      "-timeId"
    ).populate("clientId", "name phone -_id");

    let sortedAppointments = appointments.sort((a, b) => {
      return a.time.split("-") > b.time.split("-") ? 1 : -1;
    });

    return res.status(200).json({ message: sortedAppointments });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "Could not find your appointments" });
  }
};

const changeAppointmentStatus = async (req, res, next) => {
  try {
    const { status, role } = req.body;

    let populate = role === "user" ? "businessId" : "clientId";

    const appointment = await Appointment.findById(req.params.id).populate(
      populate,
      "name phone"
    );

    if (!appointment) {
      return res
        .status(400)
        .send({ message: "Something went wrong please try again" });
    }

    if (
      !role ||
      (String(role) === "user" &&
        String(req.userId) !== String(appointment.clientId._id))
    ) {
      return res.status(401).send({
        message: "You are not authorized to change this appointment.",
      });
    }

    if (
      !role ||
      (String(role) === "business" &&
        String(req.businessId) !== String(appointment.businessId._id))
    ) {
      return res
        .status(401)
        .send({ message: "You are not authorized to change this appointment" });
    }

    appointment.status.type = status;
    appointment.status.role = role;

    await appointment.save();

    return res.status(200).json({ message: appointment });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ message: "Could not change your appointment status" });
  }
};

exports.createAppointment = createAppointment;
exports.fetchAppointments = fetchAppointments;
exports.changeAppointmentStatus = changeAppointmentStatus;
exports.fetchTodaysAppointments = fetchTodaysAppointments;
