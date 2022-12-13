/* /pages/register.js */

import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import AppContext from "../components/context";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../components/firebase-config";

const Register = () => {
  const [registerUsername, setRegisterUsername] = useState("");
  const router = useRouter();
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState("false");
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const appContext = useContext(AppContext);

  const { user, setUser, isAuthenticated } = appContext;

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      setErrorMsg("");
      setShowForm(false);
      //     setSuccess(true);
    } catch (error) {
      let firebaseError = error.message;

      let errorToShow = firebaseError.replace("Firebase: ", "");
      setErrorMsg(errorToShow);
    }
  };

  const goHome = () => {
    router.push("/");
  };

  return (
    <Container>
      <Row>
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className="paper">
            <div className="header">
              <h2 style={{ paddingTop: 30, paddingLeft: 30 }}>Sign Up</h2>
            </div>
            <section className="wrapper">
              {Object.entries(error).length !== 0 &&
                error.constructor === Object &&
                error.message.map((error) => {
                  return (
                    <div
                      key={error.messages[0].id}
                      style={{ marginBottom: 10 }}
                    >
                      <small style={{ color: "red" }}>
                        {error.messages[0].message}
                      </small>
                    </div>
                  );
                })}

              <Form>
                {showForm ? (
                  <fieldset disabled={loading}>
                    <FormGroup>
                      <Label>Username:</Label>
                      <Input
                        disabled={loading}
                        onChange={(event) => {
                          setRegisterUsername(event.target.value);
                        }}
                        value={registerUsername}
                        type="text"
                        name="username"
                        style={{ height: 50, fontSize: "1.2em" }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label>Email:</Label>
                      <Input
                        onChange={(event) => {
                          setRegisterEmail(event.target.value);
                        }}
                        value={registerEmail}
                        type="email"
                        name="email"
                        style={{ height: 50, fontSize: "1.2em" }}
                      />
                    </FormGroup>
                    <FormGroup style={{ marginBottom: 30 }}>
                      <Label>Password:</Label>
                      <Input
                        onChange={(event) => {
                          setRegisterPassword(event.target.value);
                        }}
                        value={registerPassword}
                        type="password"
                        name="password"
                        style={{ height: 50, fontSize: "1.2em" }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Button
                        style={{ float: "right", width: 120 }}
                        color="primary"
                        disabled={loading}
                        onClick={register}
                      >
                        {loading ? "Loading.." : "Submit"}
                      </Button>
                    </FormGroup>
                  </fieldset>
                ) : (
                  <div>
                    <h4>Thank you for signing up! </h4>
                    <h5>An account has been created for {registerEmail}</h5>
                    <h5>You are now logged in</h5>
                    <Button style={{ marginLeft: "10px" }} onClick={goHome}>
                      Home
                    </Button>
                  </div>
                )}
              </Form>
              {errorMsg && <h4>{errorMsg}</h4>}
            </section>
          </div>
        </Col>
      </Row>
      <style jsx>
        {`
          .paper {
            border: 1px solid lightgray;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.14),
              0px 2px 1px -1px rgba(0, 0, 0, 0.12);
            border-radius: 6px;
            margin-top: 90px;
          }
          .notification {
            color: #ab003c;
          }
          .header {
            width: 100%;
            height: 120px;
            background-color: #2196f3;
            margin-bottom: 30px;
            border-radius-top: 6px;
          }
          .wrapper {
            padding: 10px 30px 20px 30px !important;
          }
          a {
            color: blue !important;
          }
          img {
            margin: 15px 30px 10px 50px;
          }
        `}
      </style>
    </Container>
  );
};
export default Register;
