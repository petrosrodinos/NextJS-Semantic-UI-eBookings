import { useState, useEffect } from "react";
import { signIn } from "next-auth/client";
import Head from "next/head";
import {
  Button,
  Checkbox,
  Form,
  Container,
  Message,
  Segment,
} from "semantic-ui-react";
import authService from "../../services/auth/authService";
import useSWR from "swr";
import { useRouter } from "next/router";
import { getSession } from "next-auth/client";

const Login = () => {
  const router = useRouter();
  const [err, setError] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [state, setState] = useState({ email: "", password: "" });

  const handleChange = (e, { name, value }) => {
    setState({ ...state, [name]: value });
  };

  const { data, error, isValidating } = useSWR(
    shouldFetch ? "auth/login" : null,
    () => authService.login(state)
  );

  const handleSubmit = async () => {
    let { email, password } = state;
    if (!email || !password) {
      setError("Please fill out all fields");
      return;
    }
    setShouldFetch(true);
  };

  useEffect(() => {
    if (error || data) {
      setShouldFetch(false);
    }
    if (data) {
      signIn("credentials", { redirect: false, ...data });
      router.push("/");
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
  }, [data, error, isValidating]);

  return (
    <>
      <Head>
        <title>E-bookings-Login</title>
        <meta name="Login" content="E bookings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container
        style={{
          width: "50%",
          padding: 50,
          paddingTop: 100,
        }}
      >
        <Segment color="teal">
          <h1 style={{ color: "teal" }}>Login</h1>
          <Form>
            <Form.Field>
              <Form.Input
                onChange={handleChange}
                name="email"
                size="large"
                fluid
                label="Email Or Phone"
                placeholder="Email Or Phone"
              />
            </Form.Field>
            <Form.Field>
              <Form.Input
                onChange={handleChange}
                name="password"
                size="large"
                type="password"
                fluid
                label="Password"
                placeholder="Password"
              />
            </Form.Field>
            <Form.Field>
              <Checkbox toggle label="Keep me logged in" />
            </Form.Field>
            <Button
              loading={isValidating}
              onClick={handleSubmit}
              color="teal"
              type="submit"
            >
              Login
            </Button>
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

export default Login;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
}
