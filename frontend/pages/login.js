import React, { useState, useEffect, useContext } from "react";
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
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  FacebookAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../components/firebase-config";

function Login(props) {
  const [data, updateData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [success, setSuccess] = useState("false");
  const [showForm, setShowForm] = useState(true);
  const [showPwResetMessage, setShowPwResetMessage] = useState(false);
  const [passwordResetMessage, setPasswordResetMessage] = useState("");

  const { user, setUser, isAuthenticated } = appContext;

  const auth = getAuth();

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const authenticate = async () => {
    try {
      const user = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPassword
      );
      setErrorMsg("");
      setShowForm(false);
    } catch (error) {
      let firebaseError = error.message;
      let errorToShow = firebaseError.replace("Firebase: ", "");
      setErrorMsg(errorToShow);
    }
  };

  const providerBook = new FacebookAuthProvider();

  const logInWithFacebook = () => {
    signInWithPopup(auth, providerBook)
      .then((result) => {
        const user = result.user;
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = FacebookAuthProvider.credentialFromError(error);
      });
  };

  const provider = new GoogleAuthProvider();

  const loginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  const logout = async () => {
    await signOut(auth);
    setShowForm(true);
    setUser({});
  };

  const goHome = () => {
    router.push("/");
  };

  const sendPasswordReset = () => {
    if (loginEmail) {
      sendPasswordResetEmail(auth, loginEmail)
        .then(() => {
          setErrorMsg("");
          setShowPwResetMessage(true);
          setPasswordResetMessage(
            `An email with a reset link was sent to ${loginEmail}`
          );
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
        });
    } else {
      alert('Please enter an email in the "Email" field');
    }
  };

  return (
    <Container>
      <Row>
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className="paper">
            <div className="header">
              <h2 style={{ paddingTop: 30, paddingLeft: 30 }}>Log In</h2>
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
              {showForm ? (
                <div>
                  <Form>
                    <fieldset disabled={loading}>
                      <FormGroup>
                        <Label>Email:</Label>
                        <Input
                          onChange={(event) => {
                            setLoginEmail(event.target.value);
                            setShowPwResetMessage(false);
                            setErrorMsg("");
                          }}
                          name="identifier"
                          style={{ height: 50, fontSize: "1.2em" }}
                        />
                      </FormGroup>
                      <FormGroup style={{ marginBottom: 30 }}>
                        <Label>Password:</Label>
                        <Input
                          onChange={(event) => {
                            setLoginPassword(event.target.value);
                            setShowPwResetMessage(false);
                            setErrorMsg("");
                          }}
                          type="password"
                          name="password"
                          style={{ height: 50, fontSize: "1.2em" }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <span>
                          <a onClick={sendPasswordReset}>
                            <small>Forgot Password?</small>
                          </a>
                        </span>
                        <Button
                          style={{ float: "right", width: 120 }}
                          color="success"
                          onClick={authenticate}
                        >
                          Login
                        </Button>
                      </FormGroup>
                      {showPwResetMessage && <h5>{passwordResetMessage}</h5>}
                    </fieldset>
                  </Form>
                  <Button
                    color="info"
                    outline
                    style={{
                      margin: "10px 100px",
                    }}
                    onClick={loginWithGoogle}
                  >
                    Login with Google
                  </Button>
                </div>
              ) : (
                <div>
                  <h4>Thank you for logging in! </h4>
                  <h5>You are now signed in as {loginEmail}</h5>
                  <Button color="primary" onClick={logout}>
                    Log Out
                  </Button>
                  <Button style={{ marginLeft: "10px" }} onClick={goHome}>
                    Home
                  </Button>
                </div>
              )}
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
            cursor: pointer;
          }
          a:hover {
            text-decoration: underline;
          }
          img {
            margin: 15px 30px 10px 50px;
          }
        `}
      </style>
    </Container>
  );
}

export default Login;
