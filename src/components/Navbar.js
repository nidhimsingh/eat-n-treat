import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import firebase from "../firebase";
import Signup from "./Signup";
import Login from "./Login";
import { useAuth } from "../auth";

function NavBar() {
  const { logout } = useAuth();
  const [email, setEmail] = useState("");
  const [loggedout, setLoggedout] = useState(true);
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      setEmail(user.email);
      setLoggedout(false);
    }
  });

  return (
    <div className="entry">
      <Navbar className="color-bg fixed-top" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>
            <Link to="/" style={{ textDecoration: "none" }}>
              Eat and Treat
            </Link>
          </Navbar.Brand>
          <Nav className="items">
            <Nav.Link>
              {/* Login */}
              {loggedout && <Login />}
            </Nav.Link>
            <Nav.Link>
              {/* Sign up */}
              {loggedout && <Signup />}
              {!loggedout && (
                <button
                  onClick={() => {
                    sessionStorage.removeItem("custId");
                    logout();
                    setLoggedout(true);
                  }}
                >
                  Log out
                </button>
              )}
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
}

export default NavBar;
