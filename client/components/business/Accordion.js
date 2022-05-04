import { Container, Button, Message, Accordion, Icon } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import HoursContainer from "./HoursContainer";

const Acordion = ({
  index,
  day,
  handleClick,
  activeIndex,
  onAddRecord,
  onDeleteRecord,
}) => {
  const [hoursList, setHoursList] = useState([]);

  const addComponent = (record, day) => {
    onAddRecord(record, day);
    setHoursList((prev) => [
      ...prev,
      <HoursContainer
        key={uuid()}
        day={day}
        onAddRecord={addComponent}
        onDeleteRecord={onDeleteRecord}
      />,
    ]);
  };

  return (
    <Accordion key={index} fluid styled style={{ padding: 5 }}>
      <Accordion.Title
        active={activeIndex === index}
        index={index}
        onClick={handleClick}
      >
        <Icon name="dropdown" />
        {day}
      </Accordion.Title>
      <Accordion.Content active={activeIndex === index}>
        <HoursContainer
          id={uuid()}
          day={index}
          onAddRecord={addComponent}
          onDeleteRecord={onDeleteRecord}
        />
        {hoursList.map((h) => h)}
      </Accordion.Content>
    </Accordion>
  );
};

export default Acordion;
