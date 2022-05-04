import {
  Card,
  Rating,
  Grid,
  Icon,
  Button,
  Divider,
  Container,
} from "semantic-ui-react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useRouter } from "next/router";
import Image from "next/image";

const BusinessCard = ({ data, profile, children }) => {
  const router = useRouter();
  return (
    <Container>
      <Card fluid style={{ width: profile ? "90%" : "100%" }} color="teal">
        <Card.Content>
          <Card.Header style={{ color: "teal" }}>{data.name}</Card.Header>
          <Card.Meta>
            <p>{data.ownername}</p>
            <Rating disabled icon="star" defaultRating={5} maxRating={5} />
          </Card.Meta>
        </Card.Content>
        <Carousel showThumbs={false} infiniteLoop={true} showStatus={false}>
          {data.images &&
            data.images.map((image, index) => (
              <div key={index}>
                <Image
                  quality={100}
                  width="100%"
                  height="70%"
                  layout="responsive"
                  blurDataURL={image}
                  placeholder="blur"
                  alt={data.name}
                  src={image}
                />
              </div>
            ))}
        </Carousel>
        <Card.Content>
          <Card.Description style={{ textAlign: "center" }}>
            {data.description}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Grid stackable>
            <Grid.Row centered mobile={16} tablet={8} computer={6}>
              <b style={style}>
                <Icon size="large" name="location arrow" color="teal" />
                {`${data.address}, ${data.city} ,${data.area}`}
              </b>
            </Grid.Row>
            <Grid.Row centered>
              <b style={style}>
                <Icon size="large" name="mail" color="teal" />
                {data.email}
              </b>
            </Grid.Row>
            <Grid.Row centered>
              <b style={style}>
                <Icon size="large" name="phone" color="teal" />
                {data.phone}
              </b>
            </Grid.Row>
          </Grid>
          {children && (
            <>
              <br />
              <Divider />
              {children}
            </>
          )}
          {!profile && (
            <>
              <Divider />
              <Button
                fluid
                color="teal"
                onClick={() => {
                  router.push(`/business/${data._id}`);
                }}
              >
                <Icon size="large" name="book" />
                BOOK NOW
              </Button>
            </>
          )}
        </Card.Content>
      </Card>
    </Container>
  );
};

const style = {
  color: "teal",
};

export default BusinessCard;
