import { useState, useEffect, createRef } from "react";
import {
  Grid,
  Segment,
  Sticky,
  Rail,
  Ref,
  Loader,
  Message,
} from "semantic-ui-react";
import businessService from "../../services/businesses/businessService";
import BusinessCard from "../../components/business/BusinessCard";
import AppointmentCard from "../../components/business/AppointmentCard";
import News from "../../components/shared/News";
import Comments from "../../components/business/Comments";
import Head from "next/head";
import { useRouter } from "next/router";

const BusinessPage = ({ business, error }) => {
  const router = useRouter();
  const { businessId } = router.query;

  return (
    <>
      <Head>
        <title>{business ? business.name : "Unknown"}</title>
        <meta name="Create electronic bookings" content="E bookings" />
      </Head>
      <div style={{ paddingTop: 100 }}>
        {business && (
          <Grid stackable>
            <Grid.Column mobile={16} tablet={1} computer={2}></Grid.Column>
            <Grid.Column mobile={16} tablet={12} computer={10}>
              <BusinessCard profile data={business}>
                <AppointmentCard
                  name={business.name}
                  id={business._id}
                  hours={business.hours}
                />
              </BusinessCard>
            </Grid.Column>
            <Grid.Column mobile={16} tablet={12} computer={4}>
              <Comments name={business.name} id={business._id} />
            </Grid.Column>
          </Grid>
        )}
        {error && (
          <Message negative>
            <Message.Header>An Error Occured</Message.Header>
            <p>Could not find the requested business</p>
          </Message>
        )}
      </div>
    </>
  );
};

BusinessPage.defaultProps = {
  business: null,
  error: null,
};

export default BusinessPage;

export async function getServerSideProps(context) {
  const { businessId } = context.params;
  try {
    const data = await businessService.fetchBusiness(businessId);
    return {
      props: {
        business: data,
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
