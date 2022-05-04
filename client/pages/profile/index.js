import { Tab } from "semantic-ui-react";
import UserAppointments from "../../components/user/UserAppointments";
import BusinessAppointments from "../../components/business/BusinessAppointments";
import UserComments from "../../components/user/UserComments";
import BusinessComments from "../../components/business/BusinessComments";
import { getSession, useSession } from "next-auth/client";

const Profile = ({ session }) => {
  //const [session] = useSession();
  const panes = [
    {
      menuItem: "User Profile",
      render: () => (
        <Tab.Pane attached={false}>
          <User />
        </Tab.Pane>
      ),
    },
  ];

  if (session.user.name.hasBusiness) {
    panes.push({
      menuItem: "Business Profile",
      render: () => (
        <Tab.Pane attached={false}>
          <Business />
        </Tab.Pane>
      ),
    });
  }

  return (
    <Tab
      style={{ paddingLeft: 50, paddingRight: 50, paddingTop: 70 }}
      menu={{ secondary: false, pointing: true }}
      panes={panes}
    />
  );
};

const User = () => {
  const panes = [
    {
      menuItem: "Appointments",
      render: () => (
        <Tab.Pane>
          {" "}
          <UserAppointments />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Comments",
      render: () => (
        <Tab.Pane>
          {" "}
          <UserComments />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Settings",
      render: () => (
        <Tab.Pane attached={false}>
          <Settings />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
  );
};

const Business = () => {
  const panes = [
    {
      menuItem: "Todays Appointments",
      render: () => (
        <Tab.Pane>
          {" "}
          <BusinessAppointments todays />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "All Appointments",
      render: () => (
        <Tab.Pane>
          {" "}
          <BusinessAppointments />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Comments",
      render: () => (
        <Tab.Pane>
          {" "}
          <BusinessComments />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Statistics",
      render: () => (
        <Tab.Pane attached={false}>
          <Statistics />
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Settings",
      render: () => (
        <Tab.Pane attached={false}>
          <Settings />
        </Tab.Pane>
      ),
    },
  ];
  return (
    <Tab menu={{ fluid: true, vertical: true, tabular: true }} panes={panes} />
  );
};

const Settings = () => {
  const panes = [
    {
      menuItem: "Information",
      render: () => <Tab.Pane>Tab 1 Content</Tab.Pane>,
    },
    { menuItem: "Password", render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
    { menuItem: "General", render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ];
  return (
    <Tab menu={{ fluid: true, vertical: false, tabular: true }} panes={panes} />
  );
};

const Statistics = () => {
  const panes = [
    {
      menuItem: "Appointments",
      render: () => <Tab.Pane>Tab 1 Content</Tab.Pane>,
    },
    {
      menuItem: "Canceled Appointments",
      render: () => <Tab.Pane>Tab 2 Content</Tab.Pane>,
    },
    { menuItem: "No shows", render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ];
  return (
    <Tab menu={{ fluid: true, vertical: false, tabular: true }} panes={panes} />
  );
};

export default Profile;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}
