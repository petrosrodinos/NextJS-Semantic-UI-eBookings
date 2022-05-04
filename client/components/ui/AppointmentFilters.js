import React, { useState } from "react";
import { Dropdown, Input, Grid } from "semantic-ui-react";
import { DateInput } from "semantic-ui-calendar-react";

export const AppointmentBusinessFilters = ({
  handleChange,
  handleSearch,
  todays,
}) => {
  const [date, setDate] = useState(new Date().toDateString());
  const [text, setText] = useState("All");

  const handleDropdownChange = (e) => {
    handleChange(e.target.textContent);
    setText(e.target.textContent);
  };
  return (
    <>
      <Grid stackable>
        <Grid.Column stretched mobile={16} tablet={16} computer={4}>
          <Dropdown
            text={text}
            icon="filter"
            labeled
            button
            selection
            className="icon"
          >
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleDropdownChange}>All</Dropdown.Item>
              <Dropdown.Item onClick={handleDropdownChange}>
                Completed
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDropdownChange}>
                Cancelled
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDropdownChange}>
                Pending
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Grid.Column>
        <Grid.Column stretched mobile={16} tablet={16} computer={4}>
          <Input
            onChange={handleSearch}
            name="phone"
            style={{ paddingRight: 5 }}
            placeholder="Phone..."
            icon="phone"
            iconPosition="left"
          />
        </Grid.Column>
        <Grid.Column stretched mobile={16} tablet={16} computer={4}>
          <Input
            name="name"
            onChange={handleSearch}
            placeholder="Name..."
            icon="user"
            iconPosition="left"
          />
        </Grid.Column>
        <Grid.Column stretched mobile={16} tablet={16} computer={4}>
          {!todays && (
            <DateInput
              clearable
              dateFormat="MM-DD-YYYY"
              closable
              fluid
              closeOnMouseLeave
              placeholder="Date"
              iconPosition="left"
              name="date"
              onClear={() => {
                setDate(new Date().toDateString());
                handleSearch(
                  {},
                  {
                    name: "clear",
                    value: new Date().toDateString(),
                  }
                );
              }}
              onChange={(e, { name, value }) => {
                handleSearch(e, { name, value });
                setDate(value);
              }}
              value={date}
            />
          )}
        </Grid.Column>
      </Grid>
    </>
  );
};

export const AppointmentUserFilters = ({ handleChange, handleSearch }) => {
  const [text, setText] = useState("All");
  const [date, setDate] = useState(new Date().toDateString());

  const handleDropdownChange = (e) => {
    handleChange(e.target.textContent);
    setText(e.target.textContent);
  };

  return (
    <Grid stackable>
      <Grid.Column stretched mobile={16} tablet={16} computer={8}>
        <Dropdown
          text={text}
          icon="filter"
          labeled
          button
          selection
          className="icon"
        >
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleDropdownChange}>All</Dropdown.Item>
            <Dropdown.Item onClick={handleDropdownChange}>
              Completed
            </Dropdown.Item>
            <Dropdown.Item onClick={handleDropdownChange}>
              Cancelled
            </Dropdown.Item>
            <Dropdown.Item onClick={handleDropdownChange}>
              Pending
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Grid.Column>

      <Grid.Column stretched mobile={16} tablet={16} computer={8}>
        <DateInput
          clearable
          dateFormat="MM-DD-YYYY"
          closable
          fluid
          closeOnMouseLeave
          placeholder="Date"
          iconPosition="left"
          name="date"
          onClear={() => {
            setDate(new Date().toDateString());
            handleSearch(
              {},
              {
                name: "clear",
                value: new Date().toDateString(),
              }
            );
          }}
          onChange={(e, { value }) => {
            handleSearch(e, { value });
            setDate(value);
          }}
          value={date}
        />
      </Grid.Column>
    </Grid>
  );
};
