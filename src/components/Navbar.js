import React, { useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link, useHistory } from "react-router-dom";
import firebase from "../firebase";
import Signup from "./Signup";
import Login from "./Login";
import { useAuth } from "../auth";

function NavBar(props) {
  const history = useHistory();
  const { logout } = useAuth();
  const [email, setEmail] = useState("");
  const [loggedout, setLoggedout] = useState(true);

  const handleLogout = () => {
    sessionStorage.removeItem("custId");
    sessionStorage.removeItem("rID");
    logout();
    setLoggedout(true);
    props.setRID(null);
    props.setCustId(null);
    history.push("/");
  };

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setEmail(user.email);
      setLoggedout(false);
    } else {
      setLoggedout(true);
    }
  });

  return (
    <div className="entry">
      <Navbar className="color-bg fixed-top" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            {!props.change ? (
              <Link to="/" style={{ textDecoration: "none" }}>
                Eat and Treat
              </Link>
            ) : (
              <Link to="/admin" style={{ textDecoration: "none" }}>
                Admin Panel
              </Link>
            )}
          </Navbar.Brand>
          {!props.change ? (
            <Nav className="items">
              <Nav.Link>
                {/* Login */}
                {loggedout && <Login setCustId={props.setCustId} />}
              </Nav.Link>
              <Nav.Link>
                {/* Sign up */}
                {loggedout && <Signup setCustId={props.setCustId} />}
                {!loggedout && (
                  <button className="btn" onClick={handleLogout}>
                    Log out
                  </button>
                )}
                {!loggedout && (
                  <button
                    className="btn"
                    style={{ marginLeft: "2rem" }}
                    onClick={() => {
                      if (sessionStorage.getItem("rID"))
                        history.push("/order/" + sessionStorage.getItem("rID"));
                      else history.push("/customer/order");
                    }}
                  >
                    Orders
                  </button>
                )}
              </Nav.Link>
            </Nav>
          ) : (
            <></>
          )}
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
