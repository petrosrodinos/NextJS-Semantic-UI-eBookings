import { useState, useEffect, useCallback } from "react";
import { Button, Icon, Table, Message, Loader } from "semantic-ui-react";
import { AppointmentBusinessFilters } from "../ui/AppointmentFilters";
import TodaysAppointmentStats from "../ui/TodaysAppointmentStats";
import { BusinessAppointmentTableActions } from "../ui/AppointmentTableActions";
import appointmentService from "../../services/appointments/appointmentService";
import { useSession } from "next-auth/client";
import { formatDate } from "../../utils/dateFormatter";

const BusinessAppointments = ({ todays }) => {
  const [session] = useSession();
  const token = session.user.name.token;
  const [state, setState] = useState([]);
  const [isValidating, setIsvalidating] = useState(true);
  const [filtered, setFiltered] = useState(null);
  const [stats, setStats] = useState({
    completed: 0,
    pending: 0,
    cancelled: 0,
  });
  const [err, setError] = useState(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        let data;
        if (todays) {
          data = await appointmentService.fetchTodaysAppointments(token);
        } else {
          data = await appointmentService.fetchAppointments("business", token);
        }
        setState(data);
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setError(message);
      }
    };
    fetchApps();
    setIsvalidating(false);
  }, [todays]);

  const handleChange = (value) => {
    setFiltered(state);
    if (value === "Completed") {
      setFiltered(state.filter((item) => item.status === "completed"));
    } else if (value === "Cancelled") {
      setFiltered(state.filter((item) => item.status === "cancelled"));
    } else if (value === "Pending") {
      setFiltered(state.filter((item) => item.status === "pending"));
    }
  };

  const handleSearch = (e, { name, value }) => {
    setFiltered(state);
    if (name === "name") {
      setFiltered(
        state.filter((item) => item.clientId.name.toLowerCase().includes(value))
      );
    } else if (name === "phone") {
      setFiltered(
        state.filter((item) =>
          item.clientId.phone.toLowerCase().includes(value)
        )
      );
    } else if (name === "date") {
      setFiltered(
        state.filter((item) =>
          item.date.includes(new Date(value).toDateString())
        )
      );
    } else if (name === "clear") {
      setState(state);
    }
  };

  useEffect(() => {
    let completed = state.filter((item) => item.status === "completed").length;
    let pending = state.filter((item) => item.status === "pending").length;
    let cancelled = state.filter((item) => item.status === "cancelled").length;
    setStats({ completed, pending, cancelled });
  }, [state]);

  useEffect(() => {
    if (filtered === null) return;
    let completed = filtered.filter(
      (item) => item.status === "completed"
    ).length;
    let pending = filtered.filter((item) => item.status === "pending").length;
    let cancelled = filtered.filter(
      (item) => item.status === "cancelled"
    ).length;
    setStats({ completed, pending, cancelled });
  }, [filtered]);

  const onStatusChange = (data) => {
    const temp = state;
    let index = temp.findIndex((appointment) => appointment._id === data._id);
    let filtered = temp.filter((appointment) => appointment._id !== data._id);
    filtered.splice(index, 0, data);
    setState(filtered);
  };

  const TableRow = ({ s }) => {
    return (
      <Table.Row
        positive={s.status.type === "completed"}
        error={s.status.type === "cancelled"}
        key={s._id}
      >
        <Table.Cell>{s.clientId.name}</Table.Cell>
        <Table.Cell>{s.clientId.phone}</Table.Cell>
        <Table.Cell>{formatDate(s.date)}</Table.Cell>
        <Table.Cell>{s.time}</Table.Cell>
        <Table.Cell>
          <BusinessAppointmentTableActions
            date={s.date}
            status={s.status}
            id={s._id}
            todays={todays}
            token={token}
            onStatusChange={onStatusChange}
          />
        </Table.Cell>
      </Table.Row>
    );
  };

  return (
    <>
      <AppointmentBusinessFilters
        todays={todays}
        handleChange={handleChange}
        handleSearch={handleSearch}
      />
      {!state ||
        (state.length === 0 && !err && (
          <Message negative>
            <Message.Header>Hmmm</Message.Header>
            <p>Could not find any appointments</p>
          </Message>
        ))}
      <Loader size="large" active={isValidating} inline="centered" />

      {!isValidating && state.length > 0 && (
        <>
          <Table stackable celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {!filtered &&
                state.map((s, index) => <TableRow s={s} key={index} />)}
              {filtered &&
                filtered.map((s, index) => <TableRow s={s} key={index} />)}
            </Table.Body>

            {!todays && (
              <Table.Footer fullWidth>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell colSpan="4">
                    <Button
                      floated="right"
                      icon
                      labelPosition="left"
                      color="teal"
                      size="small"
                    >
                      <Icon name="add" /> Add Appointment
                    </Button>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            )}
          </Table>
          {todays && !isValidating && (
            <TodaysAppointmentStats stats={stats} state={state} />
          )}
        </>
      )}
      {err && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{err}</p>
        </Message>
      )}
    </>
  );
};

export default BusinessAppointments;
