import { useEffect, useState } from "react";
import { Popup, Icon } from "semantic-ui-react";
import useSWR from "swr";
import appointmentService from "../../services/appointments/appointmentService";

export const BusinessAppointmentTableActions = ({
  id,
  todays,
  status,
  date,
  token,
  onStatusChange,
}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error } = useSWR(shouldFetch ? shouldFetch : null, () =>
    appointmentService.changeAppointmentStatus(shouldFetch, token)
  );

  useEffect(() => {
    if (data || error) {
      setShouldFetch(false);
    }
    if (data) {
      onStatusChange(data);
    }
  }, [data, error]);

  if (status.type === "pending") {
    return (
      <div style={{ textAlign: "center" }}>
        {!todays && !checkDateAfter(date) && (
          <Popup
            content="Check-In"
            trigger={
              <Icon
                color="green"
                name="check"
                size="big"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShouldFetch({
                    id,
                    status: "completed",
                    role: "business",
                  });
                }}
              />
            }
          />
        )}
        {todays && (
          <Popup
            content="Check-In"
            trigger={
              <Icon
                color="green"
                name="check"
                size="big"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setShouldFetch({
                    id,
                    status: "completed",
                    role: "business",
                  });
                }}
              />
            }
          />
        )}
        <Popup
          content="Cancel"
          trigger={
            <Icon
              onClick={() =>
                setShouldFetch({
                  id,
                  status: "cancelled",
                  role: "business",
                })
              }
              color="red"
              name="cancel"
              size="big"
              style={{ cursor: "pointer" }}
            />
          }
        />
        {!checkDateBefore(date) && !todays && (
          <Popup
            content="Edit"
            trigger={
              <Icon
                size="big"
                color="yellow"
                name="edit"
                style={{ cursor: "pointer" }}
              />
            }
          />
        )}
        {todays && (
          <Popup
            content="Edit"
            trigger={
              <Icon
                size="big"
                color="yellow"
                name="edit"
                style={{ cursor: "pointer" }}
              />
            }
          />
        )}
      </div>
    );
  } else {
    return status.role === "business" ? (
      <div style={{ textAlign: "center" }}>
        <Popup
          content="Change Status"
          trigger={
            <Icon
              onClick={() =>
                setShouldFetch({
                  id,
                  status: "pending",
                  role: "business",
                })
              }
              style={{ cursor: "pointer" }}
              size="big"
              color="yellow"
              name="arrow circle left"
            />
          }
        />
      </div>
    ) : (
      <div style={{ textAlign: "center" }}>
        <Popup
          content="Cancelled by client"
          trigger={
            <Icon
              disabled
              style={{ cursor: "not-allowed" }}
              size="big"
              color="yellow"
              name="arrow circle left"
            />
          }
        />
      </div>
    );
  }
};

export const UserAppointmentTableActions = ({
  id,
  status,
  date,
  token,
  onStatusChange,
}) => {
  const [shouldFetch, setShouldFetch] = useState(false);
  const { data, error } = useSWR(shouldFetch ? "change/status" : null, () =>
    appointmentService.changeAppointmentStatus(shouldFetch, token)
  );

  useEffect(() => {
    if (data || error) {
      setShouldFetch(false);
    }
    if (data) {
      onStatusChange(data);
    }
  }, [data, error]);

  if (status.type === "pending") {
    return (
      <>
        {checkDateTodayAfter(date) && (
          <div style={{ textAlign: "center" }}>
            <Popup
              content="Edit"
              trigger={
                <Icon
                  style={{ paddingRight: 40, cursor: "pointer" }}
                  color="yellow"
                  name="edit"
                  size="big"
                />
              }
            />
            <Popup
              content="Cancel"
              trigger={
                <Icon
                  onClick={() =>
                    setShouldFetch({
                      id,
                      status: "cancelled",
                      role: "user",
                    })
                  }
                  color="red"
                  name="cancel"
                  size="big"
                  style={{ cursor: "pointer" }}
                />
              }
            />
          </div>
        )}
      </>
    );
  } else {
    return <p>{status.type.toUpperCase()}</p>;
  }
};

function checkDateBefore(date) {
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 1);
  return new Date(date) < cutoff;
}

function checkDateAfter(date) {
  var cutoff = new Date();
  cutoff.setDate(cutoff.getDate());
  return new Date(date) > cutoff;
}

function checkDateTodayAfter(date) {
  var varDate = new Date(date);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return varDate >= today;
}
