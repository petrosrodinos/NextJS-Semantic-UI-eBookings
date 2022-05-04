import { useEffect, useState } from "react";
import businessService from "../../../services/businesses/businessService";
import { Container, Button, Message, Icon } from "semantic-ui-react";
import Acordion from "../../../components/business/Accordion";
import { useRouter } from "next/router";
import useSWR from "swr";
import { getSession } from "next-auth/client";
import Head from "next/head";

const Hours = ({ session }) => {
  const router = useRouter();
  const [hours, setHours] = useState([]);
  const [details, setDetails] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [err, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error, isValidating } = useSWR(
    shouldFetch ? "fetch/businesses" : null,
    () => businessService.createBusiness(shouldFetch)
  );
  const days = [
    "Sunday",
    "Monday",
    "Thuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const handleClick = (e, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  const handleSubmit = () => {
    if (!details || !hours) return;
    setShouldFetch({
      ...details,
      userId: session.user.name.userId,
      hours: hours,
    });
  };

  const addRecord = (record, day) => {
    if (typeof window !== "undefined") {
      let temp = JSON.parse(localStorage.getItem("hours"));
      const dayIndex = temp.findIndex((r) => r.day === day);
      if (dayIndex != -1) {
        const newRecord = temp[dayIndex].hours.concat(record);
        temp[dayIndex].hours = newRecord;
        setHours(temp);
        localStorage.setItem("hours", JSON.stringify(temp));
      } else {
        let newRecord = {
          day: day,
          hours: [record],
        };
        let newR = hours.concat(newRecord);
        localStorage.setItem("hours", JSON.stringify(newR));
        setHours(newR);
      }
    }
  };

  const deleteRecord = (id, day) => {
    if (typeof window !== "undefined") {
      let temp = JSON.parse(localStorage.getItem("hours"));
      const dayIndex = temp.findIndex((r) => r.day === day);
      if (dayIndex != -1) {
        const filteredHours = temp[dayIndex].hours.filter((h) => h.id !== id);
        temp[dayIndex].hours = filteredHours;
        setHours(temp);
        localStorage.setItem("hours", JSON.stringify(temp));
      }
    }
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

    if (data) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("hours");
      }
      router.push("/profile");
    }
  }, [data, error, isValidating]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const info = JSON.parse(localStorage.getItem("info"));
      if (info) {
        setDetails(info);
        localStorage.removeItem("info");
      }
    }
  }, [router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hours", JSON.stringify([]));
    }
  }, []);

  return (
    <>
      <Head>
        <title>eBookings-Hours</title>
        <meta name="Create electronic bookings" content="E bookings" />
      </Head>
      <Container style={{ paddingTop: 100 }}>
        {err && (
          <Message negative>
            <Message.Header>An Error Occured</Message.Header>
            <p>{err}</p>
          </Message>
        )}
        {days.map((day, index) => (
          <Acordion
            onAddRecord={addRecord}
            onDeleteRecord={deleteRecord}
            day={day}
            index={index}
            key={index}
            handleClick={handleClick}
            activeIndex={activeIndex}
          />
        ))}
        <br />
        <Button
          loading={isValidating}
          color="teal"
          onClick={handleSubmit}
          animated
        >
          <Button.Content visible>Save</Button.Content>
          <Button.Content hidden>
            <Icon name="save" />
          </Button.Content>
        </Button>
      </Container>
    </>
  );
};

export default Hours;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
