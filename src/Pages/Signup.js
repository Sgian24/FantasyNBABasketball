import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../UserAuthContext";
import { firestore} from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import NBA from "../Assets/nba-graphic-cropped.png";
import Wave from "../Assets/waveline.svg";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";

const Signup = () => {

    const [error, setError] = useState("");
    const { signUp, logOut } = useUserAuth();
    const navigate = useNavigate();
    
    const onSignUp = async (em, pass) => {
        
        setError("");
        try {
          const userCredentials = await signUp(em, pass);
          const user = userCredentials.user
          navigate("/");
          await setDoc(doc(firestore, "users", user.uid), {
            user: formik.values.user,
            userID: user.uid,
            userEmail: user.email,
            roster: []
          });
          await logOut()
        } catch (err) {
          setError(err.message);
          console.log(error);
        }
    }

    const formik = useFormik({
      initialValues: {
          user: "",
          email:"",
          password: ""
      },
      onSubmit: (values) => {
          onSignUp(values.email, values.password)
      },
      validationSchema: Yup.object({
          user: Yup.string().max(30, "Username too long").required(),
          email: Yup.string().email().required(),
          password: Yup.string().min(8, "password too short.").max(30, "password too long.").required()        
      }),
  })
  
    return (
      <>
      <style type="text/css">
          {`
           #signInButton {
              background-color: #088395;
           }
           #signInButton:hover {
              background-color: #065e6b;
           }
           @media only screen and (max-width: 765px) {
              #nba-collage {
                  height: 40vh !important;
              }
           }
          `}

      </style>
      <Container fluid={true} >
          <Row style={{height:"100vh"}}>
              <Col style={{backgroundImage:`url(${Wave})`, backgroundPosition: "50% 30%"}} md="7" className="d-flex justify-content-center align-items-center bg-image">
                  <Image id="nba-collage"style={{height: "60vh"}} src={NBA} alt="Collage of NBA players." fluid />
                  <div style={{width: 150, marginLeft: 25}}>
                      <h1 className=" text-white">Track your Fantasy Basketball Roster</h1>
                      <p className="text-white">Sign in to compare your roster to other players across the NBA.</p>
                  </div>
              </Col>
              <Col md="5" className="bg-white d-flex flex-column align-items-center justify-content-center">
                  <h2 className="text-center mb-4">Create an account</h2>
                  { error? <Alert className="d-flex align-items-center" style={{width: 350}} onClose={() => setError("")} variant="danger" dismissible> 
                            {error === "Firebase: Error (auth/email-already-in-use)."? "Email already in use.": "Invalid email."}   
                           </Alert>: <></>
                    }
                  <Form className="w-100 d-flex flex-column align-items-center">
                      <Form.Group className="w-100 d-flex justify-content-center mb-4" as={Row} controlId="formBasicPassword">
                          <Form.Label column md={2}>Username</Form.Label>
                          <Col md={6}>
                              <Form.Control onChange={formik.handleChange} name="user" type="text" placeholder="Username" isValid={!formik.errors.user && formik.values.user.length > 0} isInvalid={!!formik.errors.user} />
                              <Form.Control.Feedback type="invalid">{formik.errors.user}</Form.Control.Feedback>
                          </Col>
                      </Form.Group>
                      <Form.Group className="w-100 d-flex justify-content-center mb-4" as={Row} controlId="formBasicEmail">
                          <Form.Label column md={2}>Email</Form.Label>
                          <Col md={6}>
                              <Form.Control onChange={formik.handleChange} name="email" type="email" placeholder="Email" isValid={!formik.errors.email && formik.values.email.length > 1} isInvalid={!!formik.errors.email} required/>
                              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                          </Col>
                      </Form.Group>
                      <Form.Group className="w-100 d-flex justify-content-center mb-4" as={Row} controlId="formBasicPassword">
                          <Form.Label column md={2}>Password</Form.Label>
                          <Col md={6}>
                              <Form.Control onChange={formik.handleChange} name="password" type="password" placeholder="Password" isValid={!formik.errors.password && formik.values.password.length > 1} isInvalid={!!formik.errors.password} />
                              <Form.Control.Feedback type="invalid">{formik.errors.password}</Form.Control.Feedback>
                          </Col>
                      </Form.Group>
                       <Button id="signInButton" className="w-25 mb-4" onClick={formik.handleSubmit} variant="primary" type="submit">
                              Sign Up
                      </Button>
                      <div className="text-center">
                          <p>Have an account? <Link style={{textDecoration: "none"}}to="/">Sign in</Link></p>
                      </div>
                  </Form>
              </Col>
          </Row>
      </Container>
  </>
    )
}

export default Signup;