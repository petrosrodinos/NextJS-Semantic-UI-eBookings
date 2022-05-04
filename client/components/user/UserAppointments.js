import { useState, useEffect, useCallback } from "react";
import { Table, Message, Loader } from "semantic-ui-react";
import { UserAppointmentTableActions } from "../ui/AppointmentTableActions";
import { AppointmentUserFilters } from "../ui/AppointmentFilters";
import appointmentService from "../../services/appointments/appointmentService";
import useSWR from "swr";
import { useSession } from "next-auth/client";
import { formatDate } from "../../utils/dateFormatter";

const UserAppointments = () => {
  const [session] = useSession();
  const token = session.user.name.token;
  const [state, setState] = useState([]);
  const [filtered, setFiltered] = useState(null);
  const [err, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(true);
  const { data, error, isValidating } = useSWR(
    shouldFetch ? "fetch/appointments" : null,
    () => appointmentService.fetchAppointments("user", token)
  );

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
    if (name === "clear") {
      setState(state);
    }
    setFiltered(
      state.filter((item) => item.date.includes(new Date(value).toDateString()))
    );
  };

  const TableRow = ({ s }) => {
    return (
      <Table.Row
        positive={s.status.type === "completed"}
        error={s.status.type === "cancelled"}
        key={s._id}
      >
        <Table.Cell>{s.businessId.name}</Table.Cell>
        <Table.Cell>{s.businessId.phone}</Table.Cell>
        <Table.Cell>{formatDate(s.date)}</Table.Cell>
        <Table.Cell>{s.time}</Table.Cell>
        <Table.Cell>{formatDate(s.created)}</Table.Cell>
        <Table.Cell>
          <UserAppointmentTableActions
            onStatusChange={onStatusChange}
            token={token}
            date={s.date}
            status={s.status}
            id={s._id}
          />
        </Table.Cell>
      </Table.Row>
    );
  };

  const onStatusChange = (data) => {
    const temp = state;
    let index = temp.findIndex((appointment) => appointment._id === data._id);
    let filtered = temp.filter((appointment) => appointment._id !== data._id);
    filtered.splice(index, 0, data);
    setState(filtered);
  };

  useEffect(() => {
    if (error || data) {
      setShouldFetch(false);
    }
    if (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setError(message);
    }

    if (Array.isArray(data)) {
      setState(data);
    }
  }, [data, error, isValidating]);

  return (
    <>
      {!state ||
        (state.length === 0 && !err && (
          <Message negative>
            <Message.Header>Hmmm</Message.Header>
            <p>You have not made any appointments yet</p>
          </Message>
        ))}
      <Loader size="large" active={isValidating} inline="centered" />
      {!isValidating && state.length > 0 && (
        <>
          <AppointmentUserFilters
            handleSearch={handleSearch}
            handleChange={handleChange}
          />
          <Table celled stackable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Name</Table.HeaderCell>
                <Table.HeaderCell>Phone</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
                <Table.HeaderCell>Time</Table.HeaderCell>
                <Table.HeaderCell>Created</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body>
              {!filtered &&
                state.map((s, index) => <TableRow s={s} key={index} />)}
              {filtered &&
                filtered.map((s, index) => <TableRow s={s} key={index} />)}
            </Table.Body>
          </Table>
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

export default UserAppointments;
