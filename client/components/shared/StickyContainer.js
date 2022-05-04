import { Grid, Segment, Sticky, Rail, Ref } from "semantic-ui-react";
import Filters from "./Filters";
import News from "./News";
import { createRef } from "react";

const StickyContainer = ({ children }) => {
  const contextRef = createRef();
  return (
    <Grid stackable centered columns={2}>
      <Grid.Column>
        <Ref innerRef={contextRef}>
          <Segment>
            <Rail position="left">
              <Sticky style={{ width: "100vh" }} context={contextRef}>
                <Filters />
              </Sticky>
            </Rail>
            {children}
            <Rail position="right">
              <Sticky context={contextRef}>
                <News />
                <News />
              </Sticky>
            </Rail>
          </Segment>
        </Ref>
      </Grid.Column>
    </Grid>
  );
};

export default StickyContainer;
