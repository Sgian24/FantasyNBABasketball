import { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { ErrorMessage, useFormik } from "formik";
import * as Yup from "yup";
import NBA from "../Assets/nba-graphic-cropped.png";
import Wave from "../Assets/waveline.svg";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useUserAuth } from "../UserAuthContext";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from "react-bootstrap/Image";

const Login = () => {

    const [error, setError] = useState("");
    const {logIn} = useUserAuth();
    const navigate = useNavigate();

    const onLogIn = async ( em, p) => {
        try {
            await logIn(em, p);
            navigate("/home");
        } catch (err) {
            setError("wrong login")
        }
    };

const formik = useFormik({
    initialValues: {
        email:"",
        password: ""
    },
    onSubmit: (values) => {
        onLogIn(values.email, values.password)
    },
    validationSchema: Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().required()        
    }),
})

useEffect(() => {
    const button = document.getElementById("signInButton")
    const testing = () => {
        if (formik.values.email === "" || formik.values.password === "" || !formik.values.email.includes("@")) {
            setError("blank")
        }
    }
    button.addEventListener("click", testing)
    return () => button.removeEventListener("click", testing)
},[formik.values])

   console.log(error);
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
                    <h2 className="text-center mb-4">Sign In</h2>
                    { error? <Alert className="d-flex align-items-center" style={{width: 350}} onClose={() => setError("")} variant="danger" dismissible> 
                                Incorrect username or password.   
                             </Alert>: <></>
                    }
                    <Form className="w-100 d-flex flex-column align-items-center">
                        <Form.Group className="w-100 d-flex justify-content-center mb-4" as={Row} controlId="formBasicEmail">
                            <Form.Label column md={2}>Email</Form.Label>
                            <Col md={6}>
                                <Form.Control onChange={formik.handleChange} name="email" type="email" placeholder="Email" required/>
                            </Col>
                        </Form.Group>
                        <Form.Group className="w-100 d-flex justify-content-center mb-4" as={Row} controlId="formBasicPassword">
                            <Form.Label column md={2}>Password</Form.Label>
                            <Col md={6}>
                                <Form.Control onChange={formik.handleChange} name="password" type="password" placeholder="Password" />
                            </Col>
                        </Form.Group>
                         <Button id="signInButton" className="w-25 mb-4" onClick={formik.handleSubmit} variant="primary" type="submit">
                                Sign In
                        </Button>
                        <div className="text-center">
                            <p>Don't have an account? <Link style={{textDecoration: "none"}}to="/signup">Sign up</Link></p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    </>
    )
};

export default Login;