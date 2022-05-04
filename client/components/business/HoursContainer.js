import React, { useEffect, useState } from "react";
import { Form, Button, Segment } from "semantic-ui-react";
import { TimeInput } from "semantic-ui-calendar-react";
import { v4 as uuid } from "uuid";

const HoursContainer = ({ day, onAddRecord, onDeleteRecord }) => {
  const [addPressed, setAddPressed] = useState(false);
  const [deletePressed, setDeletePressed] = useState(false);
  const [state, setState] = useState({
    people: "1",
    from: "",
    to: "",
    id: "",
  });

  const handleChange = (e, { name, value }) => {
    setState({ ...state, [name]: value });
  };

  const addRecord = () => {
    const { people, from, to } = state;
    if (!people || !from || !to) return;
    let id = uuid();
    setState({ ...state, id: id });
    setAddPressed(true);
    onAddRecord({ ...state, id: id }, day);
  };

  const removeRecord = (id) => {
    onDeleteRecord(id, day);
  };

  return (
    <>
      {!deletePressed && (
        <Segment color="teal">
          <Form>
            <Form.Input
              type="number"
              name="people"
              size="large"
              fluid
              label="People per session"
              placeholder="People per session"
              value={state.people}
              onChange={handleChange}
            />
            <Form.Group>
              <TimeInput
                name="from"
                placeholder="From"
                value={state.from}
                iconPosition="left"
                onChange={handleChange}
              />
              <TimeInput
                name="to"
                placeholder="To"
                value={state.to}
                iconPosition="left"
                onChange={handleChange}
              />
              {!addPressed && (
                <Button type="button" onClick={addRecord} basic color="green">
                  Add
                </Button>
              )}
              {addPressed && (
                <Button
                  type="button"
                  onClick={() => {
                    removeRecord(state.id);
                    setDeletePressed(true);
                  }}
                  basic
                  color="red"
                >
                  Remove
                </Button>
              )}
            </Form.Group>
          </Form>
        </Segment>
      )}
    </>
  );
};

export default HoursContainer;
