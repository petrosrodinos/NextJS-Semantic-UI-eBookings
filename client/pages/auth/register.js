import React, { useState, useEffect } from "react";
import { Form, Container, Message, Segment, Checkbox } from "semantic-ui-react";
import { cities, areas } from "../../data/cities";
import useSWR from "swr";
import authService from "../../services/auth/authService";
import { useRouter } from "next/router";
import Head from "next/head";
import { signIn } from "next-auth/client";

const Register = () => {
  const router = useRouter();
  const [err, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error, isValidating } = useSWR(
    shouldFetch ? "auth/register" : null,
    () => authService.register(state)
  );
  const [state, setState] = useState({
    fullname: "",
    phone: "",
    email: "",
    password: "",
    area: "",
    city: "",
    business: false,
  });

  useEffect(() => {
    if (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      setError(message);
    }
    if (error || data) {
      setShouldFetch(false);
    }
    if (data) {
      if (state.business) {
        signIn("credentials", {
          callbackUrl: "/business/new/info",
          ...data,
        });
      } else {
        router.push("/");
      }
      signIn("credentials", { redirect: false, ...data });
    }
  }, [data, error, isValidating]);

  const handleChange = (e, { name, value }) => {
    setState({ ...state, [name]: value });
  };

  const handleSubmit = async () => {
    setError(null);
    let { fullname, password, area, city, email, phone } = state;
    if (!email || !password || !fullname || !phone || !area || !city) {
      setError("Please fill out all fields");
      return;
    }
    setShouldFetch(true);
  };

  return (
    <>
      <Head>
        <title>eBookings-Register</title>
        <meta name="Create electronic bookings" content="E bookings" />
      </Head>
      <Container
        style={{
          width: "60%",
          padding: 50,
          paddingTop: 100,
        }}
      >
        <Segment color="teal">
          <h1 style={{ color: "teal" }}>Register</h1>
          <Form>
            <Form.Group widths="equal">
              <Form.Input
                size="large"
                fluid
                label="Full Name"
                placeholder="Full Name"
                name="fullname"
                onChange={handleChange}
              />
              <Form.Input
                type="number"
                name="phone"
                size="large"
                fluid
                label="Phone"
                placeholder="Phone Number"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Input
                name="email"
                size="large"
                fluid
                label="Email"
                placeholder="Email"
                onChange={handleChange}
              />
              <Form.Input
                name="password"
                size="large"
                type="password"
                fluid
                label="Password"
                placeholder="Password"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group widths="equal">
              <Form.Select
                name="city"
                size="large"
                fluid
                label="City"
                options={cities}
                placeholder="City"
                onChange={handleChange}
              />
              <Form.Select
                name="area"
                size="large"
                fluid
                label="Area"
                options={areas}
                placeholder="Area"
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Field>
              <Checkbox
                label="I have a business"
                toggle
                onClick={(e, { checked }) =>
                  setState({ ...state, business: checked })
                }
              />
            </Form.Field>
            <Form.Button
              loading={isValidating}
              onClick={handleSubmit}
              color="teal"
              type="submit"
            >
              Create Account
            </Form.Button>
            {err && (
              <Message negative>
                <Message.Header>An Error Occured</Message.Header>
                <p>{err}</p>
              </Message>
            )}
          </Form>
        </Segment>
      </Container>
    </>
  );
};

export default Register;
