import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useUserAuth } from "../UserAuthContext";
import { firestore } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

const Signup = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
   
    const { signUp, logOut } = useUserAuth();
    
    const navigate = useNavigate();
    
    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
          const userCredentials = await signUp(email, password);
          const user = userCredentials.user
          navigate("/");
          await setDoc(doc(firestore, "users", user.uid), {
            userID: user.uid,
            userEmail: user.email,
            roster: [""]
          });
          await logOut()
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