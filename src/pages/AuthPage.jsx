import { useState, useEffect } from "react";
import { Col, Image, Row, Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import useLocalStorage from "use-local-storage";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const loginImage = "https://sig1.co/img-twitter-1";
  const url = "https://auth-back-end-suwanki.sigma-school-full-stack.repl.co";

  const [modalShow, setModalShow] = useState(null);
  const handleShowSignUp = () => {
    setModalShow("SignUp");
    setFailedMessage("");
  };

  const handleShowLogin = () => {
    setModalShow("Login");
    setFailedMessage("");
  };

  const handleClose = () => setModalShow(null);

  const [failedMessage, setFailedMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authToken, setAuthToken] = useLocalStorage("authToken", "");

  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      navigate("/profile");
    }
  }, [authToken, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/login`, { username, password });
      if (res.data && res.data.auth === true && res.data.token) {
        setAuthToken(res.data.token);
        console.log(res.data);
        setFailedMessage("");
      }
    } catch (error) {
      setFailedMessage("Please check your login details and try again.");
      console.error(error);
    }
  };

  const getUsers = async () => {
    try {
      const res = await axios.get(`${url}/users`);
      return res.data.users;
    } catch (error) {
      console.error(error);
    }
  };

  getUsers();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      const registeredUsers = await getUsers();

      if (registeredUsers.includes(username)) {
        setFailedMessage(
          "Username/Email already already registered to another user."
        );
        return;
      }

      if (password.length <= 2) {
        setFailedMessage("Password too weak");
      }

      const res = await axios.post(`${url}/signup`, { username, password });
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Row>
      <Col sm={6}>
        <Image src={loginImage} fluid />
      </Col>
      <Col sm={6} className='p-4'>
        <i
          className='bi bi-twitter'
          style={{ fontSize: 50, color: "dodgerblue" }}
        ></i>
        <p className='mt-5' style={{ fontSize: 64 }}>
          Happening Now
        </p>
        <h2 className='my-5' style={{ fontSize: 31 }}>
          Join Twitter Today.
        </h2>
        <Col sm={5} className='d-grid gap-2'>
          <Button className='rounded-pill' variant='outline-dark'>
            <i className='bi bi-google'></i> Sign up with Google
          </Button>
          <Button className='rounded-pill' variant='outline-dark'>
            <i className='bi bi-apple'></i> Sign up with Apple
          </Button>
          <p style={{ textAlign: "center" }}>or</p>
          <Button className='rounded-pill' onClick={handleShowSignUp}>
            Create an account
          </Button>
          <p style={{ fontSize: "12px" }}>
            By signing up, you agree to the Terms of Service and Privacy Policy,
            including Cookie Use.
          </p>

          <p className='mt-5' style={{ fontWeight: "bold" }}>
            Already have an account?
          </p>
          <Button
            className='rounded-pill'
            variant='outline-primary'
            onClick={handleShowLogin}
          >
            Sign in
          </Button>
        </Col>
        <Modal
          show={modalShow !== null}
          onHide={handleClose}
          animation={false}
          centered
        >
          <Modal.Body className='d-grid gap-2 px-5'>
            <h2 className='mb-4' style={{ fontWeight: "bold" }}>
              {modalShow === "SignUp"
                ? "Create your account"
                : "Login to your account"}
            </h2>
            <Form
              className='d-grid gap2 px-5'
              onSubmit={modalShow === "SignUp" ? handleSignUp : handleLogin}
            >
              <Form.Group className='mb-3' controlId='formBasicEmail'>
                <Form.Control
                  onChange={(e) => setUsername(e.target.value)}
                  type='text'
                  placeholder='Enter Email'
                />
              </Form.Group>

              <Form.Group className='mb-3' controlId='formBasicPassword'>
                <Form.Control
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  placeholder='Enter Password'
                />
              </Form.Group>
              <p style={{ color: "red" }}>{failedMessage}</p>
              <p style={{ fontSize: "12px" }}>
                By singing up, you agree to the terms of Serivce and Privacy
                Policy, including Cookie Use. Bettwe Tweets may use your contact
                information, including your email address and phone number for
                purposes outlined in our Privacy Policy, like keeping your
                account secure and personalising our services, including ads.
                Learn More. Others will be able to find you by email or phone
                number, when provided, unlessx you choose otherwise here.
              </p>

              <Button
                className='rounded-pill'
                variant='outline-primary'
                type='submit'
              >
                {modalShow === "SignUp" ? "Sign Up" : "Log In"}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Col>
    </Row>
  );
}
