import React, { useState } from "react";
import { Icon } from "semantic-ui-react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/client";
import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerContent,
  useBreakpointValue,
  VStack,
  Center,
  Text,
  Link,
} from "@chakra-ui/react";
import { Button, Dropdown, Menu } from "semantic-ui-react";

const Header = ({ showSidebarButton = true, onShowSidebar }) => {
  const router = useRouter();
  const [session] = useSession();
  const [active, setActive] = useState("home");
  const user = session;
  const handleItemClick = (e, { name }) => setActive(name);
  return (
    <Menu fixed="top" size="large" style={{ border: "none" }} borderless={true}>
      {showSidebarButton ? (
        <>
          <Menu.Item>
            <Icon
              color="teal"
              name="th list"
              size="big"
              onClick={onShowSidebar}
            />
          </Menu.Item>
          <Menu.Item>
            <Center flex="1" h="40px">
              <Text fontSize="3xl">e-Bookings</Text>
            </Center>
          </Menu.Item>
        </>
      ) : (
        <>
          <Menu.Item
            name="home"
            active={active === "home"}
            onClick={(e, l) => {
              handleItemClick(e, l);
              router.push("/");
            }}
          />

          {user && (
            // <Menu.Item
            //   name="profile"
            //   active={active === "profile"}
            //   onClick={(e, l) => {
            //     handleItemClick(e, l);
            //     router.push(`/profile/user/${user.user.name.userId}`);
            //   }}
            // />

            <Menu.Item
              name="profile"
              active={active === "profile"}
              onClick={(e, l) => {
                handleItemClick(e, l);
                router.push(`/profile`);
              }}
            />
          )}
          {user && <Menu.Item name="messages" active={active === "messages"} />}
          <Menu.Item name="about" active={active === "about"} />
          <Menu.Item name="contact" active={active === "contact"} />

          <Menu.Menu position="right">
            <Dropdown item text="Language">
              <Dropdown.Menu>
                <Dropdown.Item>English</Dropdown.Item>
                <Dropdown.Item>Russian</Dropdown.Item>
                <Dropdown.Item>Spanish</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item>
              {!user ? (
                <Button.Group>
                  <Link href="/auth/login">
                    <Button size="large" color="teal">
                      Login
                    </Button>
                  </Link>

                  <Button.Or />
                  <Link href="/auth/register">
                    <Button size="large" color="instagram">
                      Register
                    </Button>
                  </Link>
                </Button.Group>
              ) : (
                <Button
                  onClick={() => {
                    signOut();
                    router.push("/");
                  }}
                  size="large"
                  color="teal"
                >
                  Log out
                </Button>
              )}
            </Menu.Item>
          </Menu.Menu>
        </>
      )}
    </Menu>
  );
};

const SidebarContent = ({ onClick }) => {
  const router = useRouter();
  const [session] = useSession();
  const [active, setActive] = useState("home");
  const user = session;
  const handleItemClick = (e, { name }) => setActive(name);
  return (
    <Menu fluid stackable>
      <VStack>
        <Menu.Item
          name="home"
          active={active === "home"}
          onClick={(e, l) => {
            handleItemClick(e, l);
            router.push("/");
          }}
        />

        {user && (
          // <Menu.Item
          //   name="profile"
          //   active={active === "profile"}
          //   onClick={(e, l) => {
          //     handleItemClick(e, l);
          //     router.push(`/profile/user/${user.user.name.userId}`);
          //   }}
          // />
          <Menu.Item
            name="profile"
            active={active === "profile"}
            onClick={(e, l) => {
              handleItemClick(e, l);
              router.push(`/profile`);
            }}
          />
        )}
        {user && <Menu.Item name="messages" active={active === "messages"} />}
        <Menu.Item name="about" active={active === "about"} />
        <Menu.Item name="contact" active={active === "contact"} />

        <Menu.Menu position="right">
          <Dropdown fluid item text="Language">
            <Dropdown.Menu>
              <Dropdown.Item>English</Dropdown.Item>
              <Dropdown.Item>Russian</Dropdown.Item>
              <Dropdown.Item>Spanish</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item>
            {!user ? (
              <Button.Group>
                <Link href="/auth/login">
                  <Button size="large" color="teal">
                    Login
                  </Button>
                </Link>

                <Button.Or />
                <Link href="/auth/register">
                  <Button size="large" color="instagram">
                    Register
                  </Button>
                </Link>
              </Button.Group>
            ) : (
              <Button
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                size="large"
                color="teal"
              >
                Log out
              </Button>
            )}
          </Menu.Item>
        </Menu.Menu>
      </VStack>
    </Menu>
  );
};
const Sidebar = ({ isOpen, variant, onClose }) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Chakra-UI</DrawerHeader>
          <DrawerBody>
            <SidebarContent onClick={onClose} />
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

const NavigationBar = () => {
  const smVariant = { navigation: "sidebar", navigationButton: false };
  const mdVariant = { navigation: "drawer", navigationButton: true };
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const variants = useBreakpointValue({ base: mdVariant, md: smVariant });
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  return (
    <>
      <Sidebar
        position="fixed"
        variant={variants?.navigation}
        isOpen={isSidebarOpen}
        onClose={toggleSidebar}
      />
      <Box>
        <Header
          showSidebarButton={variants?.navigationButton}
          onShowSidebar={toggleSidebar}
        />
      </Box>
    </>
    // <Menu fixed="top" size="large" style={{ border: "none" }} borderless={true}>
    //   <Menu.Item
    //     name="home"
    //     active={active === "home"}
    //     onClick={(e, l) => {
    //       handleItemClick(e, l);
    //       router.push("/");
    //     }}
    //   />

    //   {user && (
    //     // <Menu.Item
    //     //   name="profile"
    //     //   active={active === "profile"}
    //     //   onClick={(e, l) => {
    //     //     handleItemClick(e, l);
    //     //     router.push(`/profile/user/${user.user.name.userId}`);
    //     //   }}
    //     // />
    //     <Menu.Item
    //       name="profile"
    //       active={active === "profile"}
    //       onClick={(e, l) => {
    //         handleItemClick(e, l);
    //         router.push(`/profile`);
    //       }}
    //     />
    //   )}
    //   {user && <Menu.Item name="messages" active={active === "messages"} />}
    //   <Menu.Item name="about" active={active === "about"} />
    //   <Menu.Item name="contact" active={active === "contact"} />

    //   <Menu.Menu position="right">
    //     <Dropdown item text="Language">
    //       <Dropdown.Menu>
    //         <Dropdown.Item>English</Dropdown.Item>
    //         <Dropdown.Item>Russian</Dropdown.Item>
    //         <Dropdown.Item>Spanish</Dropdown.Item>
    //       </Dropdown.Menu>
    //     </Dropdown>
    //     <Menu.Item>
    //       {!user ? (
    //         <Button.Group>
    //           <Link href="/auth/login">
    //             <Button size="large" color="teal">
    //               Login
    //             </Button>
    //           </Link>

    //           <Button.Or />
    //           <Link href="/auth/register">
    //             <Button size="large" color="instagram">
    //               Register
    //             </Button>
    //           </Link>
    //         </Button.Group>
    //       ) : (
    //         <Button
    //           onClick={() => {
    //             signOut();
    //             router.push("/");
    //           }}
    //           size="large"
    //           color="teal"
    //         >
    //           Log out
    //         </Button>
    //       )}
    //     </Menu.Item>
    //   </Menu.Menu>
    // </Menu>
  );
};

export default NavigationBar;
