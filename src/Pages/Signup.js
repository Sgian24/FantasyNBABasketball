import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../UserAuthContext";
import { firestore} from "../firebase";
import { setDoc, doc, collection, getDocs } from "firebase/firestore";
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
    const [userNames, setUserNames] = useState([])
    const { signUp, logOut } = useUserAuth();
    const navigate = useNavigate();

   useEffect(() => {
        const fetchUserNames = async () => {
            const collect = await getDocs(collection(firestore, "users"))
            const userNameList = []
            collect.forEach(i => userNameList.push(i.data().user))
            setUserNames(userNameList)
        }
        fetchUserNames();
    },[])
    
    const onSignUp = async (em, pass) => {
          setError("")
          if (!userNames.includes(formik.values.user)) {  
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
        }} else {
            setError("Username already in use")
        }
    }
    console.log(userNames);
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
            .image-container {
                display: none !important;
            }
            .form-container {
                width: 80vw !important;
            }
            #signInButton {
                width: 80% !important;
            }
            .col-container {
                background-color: #eff0f2 !important;
            }
            .form-input {
                width: 86% !important;
            }
           }
           @media only screen and (max-width: 376px) {
            .create-account {
                font-size: 0.7rem !important;
            }
            h2 {
                font-size: 1.2rem !important;
            }
            #signInButton {
                width: 78% !important;
            }
            .form-error {
                width: 62vw !important;
                font-size: 0.7rem;
            }
         }
          `}

      </style>
      <Container fluid={true} >
          <Row style={{height:"100vh"}}>
              <Col style={{backgroundImage:`url(${Wave})`, backgroundPosition: "50% 30%"}} md="7" className="image-container d-flex justify-content-center align-items-center bg-image">
                  <Image id="nba-collage"style={{height: "60vh"}} src={NBA} alt="Collage of NBA players." fluid />
                  <div style={{width: 150, marginLeft: 25}}>
                      <h1 className=" text-white">Visualize your Fantasy Basketball Roster</h1>
                      <p className="text-white">Sign in to visualize your NBA fantasy roster and player statistics.</p>
                  </div>
              </Col>
              <Col md="5" className="col-container bg-white d-flex flex-column align-items-center justify-content-center gap-4">
              <div className="form-container bg-white rounded d-flex flex-column align-items-center " style={{width: "40vw"}} >   
                  <h2 className="text-center mb-4 mt-3">Create an account</h2>
                  { error? <Alert className="form-error d-flex align-items-center" style={{width: 350}} onClose={() => setError("")} variant="danger" dismissible> 
                            {error === "Firebase: Error (auth/email-already-in-use)."? "Email already in use."
                            : error === "Username already in use"? "Username already in use.":"Invalid email."}   
                           </Alert>: <></>
                    }
                  <Form className="w-100 d-flex flex-column align-items-center">
                      <Form.Group className="form-input w-100 d-flex justify-content-center mb-3" as={Row} controlId="formBasicPassword">
                          <Form.Label column md={2}>Username</Form.Label>
                          <Col md={6}>
                              <Form.Control onChange={formik.handleChange} name="user" type="text" placeholder="Username" isValid={!formik.errors.user && formik.values.user.length > 0} isInvalid={!!formik.errors.user} />
                              <Form.Control.Feedback type="invalid">{formik.errors.user}</Form.Control.Feedback>
                          </Col>
                      </Form.Group>
                      <Form.Group className="form-input w-100 d-flex justify-content-center mb-3" as={Row} controlId="formBasicEmail">
                          <Form.Label column md={2}>Email</Form.Label>
                          <Col md={6}>
                              <Form.Control onChange={formik.handleChange} name="email" type="email" placeholder="Email" isValid={!formik.errors.email && formik.values.email.length > 1} isInvalid={!!formik.errors.email} required/>
                              <Form.Control.Feedback type="invalid">{formik.errors.email}</Form.Control.Feedback>
                          </Col>
                      </Form.Group>
                      <Form.Group className="form-input w-100 d-flex justify-content-center mb-4" as={Row} controlId="formBasicPassword">
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
                          <p className="create-account">Have an account? <Link style={{textDecoration: "none"}}to="/">Sign in</Link></p>
                      </div>
                  </Form>
                  </div>
                  <p className="text-right" style={{fontSize:"0.8rem", color:"#b7b9b7"}}>Developed by Sunny Gian.</p>
              </Col>
          </Row>
      </Container>
  </>
    )
}

export default Signup;