import { useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
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
    const {logIn, user} = useUserAuth();
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
    const button = document.getElementsByClassName("signInButton")[0]
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
            `}

        </style>
        <Container fluid={true} >
            <Row className="signInRow">
                <Col md="7" className="collage-image-container d-flex justify-content-center align-items-center bg-image" style={{backgroundImage:`url(${Wave})`}} >
                    <Image className="nba-collage" src={NBA} alt="Collage of NBA players." fluid />
                    <div className="heading-div">
                        <h1 className="text-white">Visualize your Fantasy Basketball Roster</h1>
                        <p className="text-white">Sign in to visualize your NBA fantasy roster and player statistics.</p>
                    </div>
                </Col>
                <Col md="5" className="col-container bg-white d-flex flex-column align-items-center justify-content-center gap-4">
                    <h2 className="d-lg-none d-md-none">Fantasy Basketball Visualizer</h2>
                    <div className="signin-form-container rounded d-flex flex-column align-items-center">    
                        <h2 className="text-center mb-4 mt-3 ">Sign In</h2>
                            { error? <Alert className="form-error d-flex align-items-center" onClose={() => setError("")} variant="danger" dismissible> 
                                Incorrect email or password.   
                             </Alert>: <></>
                            }
                            <Form className="w-100 d-flex flex-column align-items-center">
                            <Form.Group className="form-input w-100 d-flex justify-content-center mb-4" as={Row} controlId="formBasicEmail">
                            <Form.Label column md={3} lg={2}>Email</Form.Label>
                            <Col md={6}>
                                <Form.Control onChange={formik.handleChange} name="email" type="email" placeholder="Email" required/>
                            </Col>
                            </Form.Group>
                            <Form.Group className="form-input w-100 d-flex justify-content-center mb-4" as={Row} controlId="formBasicPassword">
                                <Form.Label column md={3} lg={2}>Password</Form.Label>
                                <Col md={6}>
                                    <Form.Control onChange={formik.handleChange} name="password" type="password" placeholder="Password" />
                                </Col>
                            </Form.Group>
                            <Button className="signInButton w-25 mb-4" onClick={formik.handleSubmit} variant="primary" type="submit">
                                    Sign In
                            </Button>
                            <div className="text-center create-account-container">
                                <p className="create-account">Don't have an account? <Link className="text-decoration-none" to="/signup">Create an account</Link></p>
                                <p className="demo">* For demo purposes you can login with; <br /> Email: rxdtxjojfihpphcjbi@nbmbb.com <br/> Password: qwerty12345.</p>
                            </div>
                            </Form>
                    </div>
                    <p className="footer-text text-right">Developed by Sunny Gian.</p>
                </Col>
            </Row>
        </Container>
    </>
    )
};

export default Login;