import React from "react";
import { Statistic, Segment } from "semantic-ui-react";

const TodaysAppointmentStats = ({ stats, state }) => {
  return (
    <Segment>
      <Statistic size="mini">
        <Statistic.Value>{state.length}</Statistic.Value>
        <Statistic.Label>Total</Statistic.Label>
      </Statistic>
      <Statistic size="mini">
        <Statistic.Value>{stats.pending}</Statistic.Value>
        <Statistic.Label>Pending</Statistic.Label>
      </Statistic>
      <Statistic size="mini">
        <Statistic.Value>{stats.completed}</Statistic.Value>
        <Statistic.Label>Completed</Statistic.Label>
      </Statistic>
      <Statistic size="mini">
        <Statistic.Value>{stats.cancelled}</Statistic.Value>
        <Statistic.Label>Cancelled</Statistic.Label>
      </Statistic>
    </Segment>
  );
};

export default TodaysAppointmentStats;
