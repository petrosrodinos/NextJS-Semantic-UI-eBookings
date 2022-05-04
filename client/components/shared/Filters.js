import { Icon, Input, Container, Form, Button, Card } from "semantic-ui-react";
import { useState } from "react";
import { DateInput, TimeInput } from "semantic-ui-calendar-react";
import { cities, areas, types } from "../../data/cities";
import { useMediaQuery } from "react-responsive";
import { useEffect } from "react";

const Filters = () => {
  const [state, setState] = useState({
    position: "",
    top: "",
    width: "",
    left: "",
  });
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-device-width: 992px)",
  });
  const [filters, setFilters] = useState({
    date: new Date().toDateString(),
    type: "",
    from: "",
    to: "",
    city: "",
    area: "",
    rating: "",
  });

  const handleChange = (e, { name, value }) => {
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    let position = isDesktopOrLaptop ? "fixed" : "relative";
    let top = isDesktopOrLaptop ? "90px" : "80px";
    let width = isDesktopOrLaptop ? "17%" : "95%";
    let left = isDesktopOrLaptop ? "20px" : "0px";
    setState({ position, top, width, left });
  }, []);

  return (
    <Container style={{ paddingBottom: isDesktopOrLaptop ? 0 : 15 }}>
      <Card
        centered
        fluid
        color="teal"
        style={{
          position: state.position,
          width: state.width,
          top: state.top,
          border: "none",
          left: state.left,
          minHeight: "500px",
        }}
      >
        <Card.Content style={{ fontSize: 17 }}>
          <Input fluid iconPosition="left" placeholder="Search">
            <Icon name="search" />
            <input />
          </Input>
          <h3
            style={{ ...style, color: "teal", paddingTop: 10 }}
            className="tealcolor"
          >
            What are you looking for
          </h3>
          <Form.Select
            style={{ ...style, color: "teal" }}
            size="large"
            fluid
            options={types}
            placeholder="Type"
            name="type"
            onChange={handleChange}
          />
          <h3
            style={{ ...style, color: "teal", paddingTop: 10 }}
            className="tealcolor"
          >
            Day
          </h3>
          <DateInput
            dateFormat="MM-DD-YYYY"
            closable
            closeOnMouseLeave
            minDate={new Date()}
            style={{ color: "teal" }}
            fluid
            placeholder="Date"
            value={filters.date}
            iconPosition="left"
            name="date"
            onChange={handleChange}
          />
          <h3
            style={{ ...style, color: "teal", paddingTop: 10 }}
            className="tealcolor"
          >
            Time
          </h3>
          <TimeInput
            closable
            style={{ color: "teal" }}
            fluid
            name="from"
            placeholder="From"
            value={filters.from}
            iconPosition="left"
            onChange={handleChange}
          />
          <br />
          <TimeInput
            closable
            style={{ color: "teal" }}
            fluid
            name="to"
            placeholder="To"
            value={filters.to}
            iconPosition="left"
            onChange={handleChange}
          />
          <h3
            style={{ ...style, color: "teal", paddingTop: 10 }}
            className="tealcolor"
          >
            Place
          </h3>
          <Form.Select
            size="large"
            fluid
            options={cities}
            placeholder="City"
            name="city"
            onChange={handleChange}
          />
          <br />
          <Form.Select
            fluid
            options={areas}
            placeholder="Area"
            name="area"
            onChange={handleChange}
          />
          <br />
          <Button
            color="teal"
            onClick={() => alert("I dont work yet")}
            animated
            fluid
          >
            <Button.Content visible>Search</Button.Content>
            <Button.Content hidden>
              <Icon name="arrow right" />
            </Button.Content>
          </Button>
        </Card.Content>
      </Card>
    </Container>
  );
};

const style = {
  paddingBottom: 15,
};

export default Filters;
