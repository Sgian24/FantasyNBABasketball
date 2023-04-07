import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {auth} from "../firebase";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useUserAuth } from "../UserAuthContext";

const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
   
    const { signUp } = useUserAuth();
    
    const navigate = useNavigate();
    
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await signUp(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message);
        }
    }
    return (
        <>
        <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control onChange={(e) => setPassword(e.target.value)} type="password" placeholder="password" />
            </Form.Group>
            <Button onClick={onSubmit} variant="primary" type="submit">
                Submit
            </Button>
        </Form>
        <div>
            <p>Have an account?</p>
            <Link to="/">Log In</Link>
        </div>
        </>
    )
}

export default Signup;