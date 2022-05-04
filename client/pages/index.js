import { Message, Container, Grid } from "semantic-ui-react";
import BusinessCard from "../components/business/BusinessCard";
import businessService from "../services/businesses/businessService";
import Head from "next/head";
import Filters from "../components/shared/Filters";
import News from "../components/shared/News";

const Home = ({ businesses, error }) => {
  return (
    <>
      <Head>
        <title>eBookings</title>
        <meta name="Create electronic bookings" content="E bookings" />
      </Head>
      <Grid stackable style={{ paddingTop: 20 }}>
        <Grid.Column
          style={{ paddingTop: 70 }}
          mobile={16}
          tablet={6}
          computer={3}
        >
          <Filters />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={6} computer={10}>
          <Container style={{ paddingTop: 70 }}>
            {error && (
              <Message negative>
                <Message.Header>An Error Occured</Message.Header>
                <p>Could not fetch businesses</p>
              </Message>
            )}
            <Grid>
              {businesses.length > 0 &&
                businesses.map((data, index) => (
                  <Grid.Column key={index} mobile={16} tablet={16} computer={8}>
                    <BusinessCard data={data} />
                  </Grid.Column>
                ))}
            </Grid>
            {!businesses.length > 0 && !error && (
              <Message negative>
                <Message.Header>Oups</Message.Header>
                <p>
                  Could not find any business,maybe <kbd>Ctrl</kbd> +{" "}
                  <kbd>R</kbd>
                </p>
              </Message>
            )}
          </Container>
        </Grid.Column>
        <Grid.Column mobile={16} tablet={4} computer={3}>
          <Grid style={{ position: "fixed", paddingTop: 70 }}>
            <Grid.Row>
              <News name="Future" />
            </Grid.Row>
            <Grid.Row>
              <News name="Recent" />
            </Grid.Row>
          </Grid>
        </Grid.Column>
      </Grid>
    </>
  );
};

Home.defaultProps = {
  businesses: [],
  error: null,
};

export default Home;

export async function getServerSideProps() {
  try {
    const data = await businessService.fetchBusinesses();
    return {
      props: {
        businesses: data,
      },
    };
  } catch (error) {
    return {
      props: {
        error: true,
      },
    };
  }
}
