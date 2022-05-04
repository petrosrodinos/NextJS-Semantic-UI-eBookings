import React from "react";
import { Card, Feed, Container } from "semantic-ui-react";

const News = ({ name }) => (
  <Container>
    <Card color="teal">
      <Card.Content>
        <Card.Header style={{ color: "teal" }}>{name} Appointments</Card.Header>
      </Card.Content>
      <Card.Content>
        <Feed>
          <Feed.Event>
            <Feed.Label image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHUndSzxcF1UbSXX3bVILVaUbSIhoc_GEA8g&usqp=CAU" />
            <Feed.Content>
              <Feed.Date content="1 day ago" />
              <Feed.Summary>
                You made appointment to <a>Anna HairDressing</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>

          <Feed.Event>
            <Feed.Label image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHUndSzxcF1UbSXX3bVILVaUbSIhoc_GEA8g&usqp=CAU" />
            <Feed.Content>
              <Feed.Date content="3 days ago" />
              <Feed.Summary>
                You made appointment to <a>Papadakis DentalCare</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>

          <Feed.Event>
            <Feed.Label image="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHUndSzxcF1UbSXX3bVILVaUbSIhoc_GEA8g&usqp=CAU" />
            <Feed.Content>
              <Feed.Date content="4 days ago" />
              <Feed.Summary>
                You made appointment to <a>SkinClinic</a>
              </Feed.Summary>
            </Feed.Content>
          </Feed.Event>
        </Feed>
      </Card.Content>
    </Card>
  </Container>
);

export default News;
