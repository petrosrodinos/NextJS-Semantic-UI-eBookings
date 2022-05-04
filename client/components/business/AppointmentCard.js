import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Icon,
  Button,
  Message,
  Confirm,
  Container,
} from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react";
import useSWR from "swr";
import { useRouter } from "next/router";
import { useSession } from "next-auth/client";
import appointmentService from "../../services/appointments/appointmentService";

const AppointmentCard = ({ hours, id, name }) => {
  const router = useRouter();
  const [session] = useSession();
  const [shouldFetch, setShouldFetch] = useState(false);
  const [date, setDate] = useState([]);
  const [err, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [confirm, setConfirm] = useState({
    open: false,
    time: {},
  });
  const [state, setState] = useState(new Date().toDateString());
  const { data, error, isValidating } = useSWR(
    shouldFetch ? "create/appointment" : null,
    () =>
      appointmentService.createAppointment(shouldFetch, session.user.name.token)
  );

  const handleChange = (e, { value }) => {
    try {
      if (!value || !hours) return;
      setState(value);
      const day = new Date(value).getDay();
      if (hours[day] === undefined) {
        setDate([]);
        return;
      }
      setDate(hours[day].hours);
    } catch (error) {
      console.log(error);
      setDate([]);
    }
  };

  const handleConfirm = () => {
    const time = `${confirm.time.from}-${confirm.time.to}`;
    setShouldFetch({
      date: state,
      timeId: confirm.time.id,
      businessId: id,
      time: time,
    });
  };

  useEffect(() => {
    if (error || data) {
      setShouldFetch(false);
    }
    if (data) {
      setSuccess(true);
      setConfirm({ ...confirm, open: false });
    }
    if (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setError(message);
      setConfirm({ ...confirm, open: false });
    }
  }, [data, error, isValidating]);

  useEffect(() => {
    try {
      if (!hours) return;
      const day = new Date().getDay();
      if (hours[day] === undefined) {
        setDate([]);
        return;
      }
      setDate(hours[day].hours);
    } catch (error) {
      console.log(error);
      setDate([]);
    }
  }, []);

  return (
    <>
      <Confirm
        open={confirm.open}
        content={() => {
          return (
            confirm && (
              <h3 style={{ padding: 10 }}>
                Confirm your appointment at <a>{name}</a> on <a>{state}</a> and
                time{" "}
                <a>
                  {confirm.time.from}-{confirm.time.to}
                </a>
              </h3>
            )
          );
        }}
        header="Confirm"
        onCancel={() => setConfirm({ ...confirm, open: false, time: {} })}
        confirmButton={() => (
          <Button
            onClick={handleConfirm}
            loading={isValidating}
            color="teal"
            type="submit"
          >
            Confirm
          </Button>
        )}
      />
      <Container style={{ width: "100%" }}>
        <Card centered fluid color="teal">
          <Card.Content>
            <Card.Header style={{ color: "teal", textAlign: "center" }}>
              MAKE YOUR APPOINTMENT
            </Card.Header>
          </Card.Content>
          <Card.Content>
            {err && <Message negative>{err}</Message>}
            {success && (
              <Message positive>Your appointment created successfuly</Message>
            )}
            <h3>Date</h3>
            <DateInput
              dateFormat="MM-DD-YYYY"
              closable
              closeOnMouseLeave
              minDate={new Date()}
              style={{ color: "teal", width: "100%" }}
              fluid
              placeholder="Date"
              value={state}
              iconPosition="left"
              name="date"
              onChange={handleChange}
            />
            {date && date.length > 0 && (
              <Table celled style={{ width: "100%" }}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>From</Table.HeaderCell>
                    <Table.HeaderCell>To</Table.HeaderCell>
                    <Table.HeaderCell>Spots</Table.HeaderCell>
                    <Table.HeaderCell></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {date &&
                    date.map((d, index) => (
                      <Table.Row key={index}>
                        <Table.Cell>{d.from}</Table.Cell>
                        <Table.Cell>{d.to}</Table.Cell>
                        <Table.Cell>3/{d.people}</Table.Cell>

                        <Table.Cell>
                          <Button
                            onClick={() => {
                              if (!session) router.push("/auth/login");
                              setConfirm({ open: true, time: d });
                            }}
                            color="teal"
                            fluid
                            icon
                          >
                            <Icon name="add" />
                          </Button>
                        </Table.Cell>
                      </Table.Row>
                    ))}
                </Table.Body>
              </Table>
            )}
          </Card.Content>
          {!date ||
            (date.length === 0 && (
              <Message style={{ margin: 20 }} color="yellow">
                There are no available appointments for this day
              </Message>
            ))}
        </Card>
      </Container>
    </>
  );
};

export default AppointmentCard;
