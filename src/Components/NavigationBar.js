import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';

const NavBar = ({onLogOut, position, setPosition}) => {
    
    return (
        <>
        <Container fluid>
           <Row style={{height: 80, marginBottom: "4vh", paddingLeft: "3.5rem", paddingRight: "3.5rem", backgroundColor:"#EEEEEE"}}className="d-flex align-items-center" >
            <Col md={10} style={{ padding: 0, }}><h1>Fantasy Basketball Visualizer</h1></Col>
            <Col className="d-flex justify-content-end gap-4">
              <Button onClick={() => setPosition(position === -1000? 0: -1000)}size="sm" style={{width: "5vw"}} variant="outline-secondary"className="">Draft</Button>
              <Button onClick={onLogOut} type="submit" size="sm" style={{width: "5vw"}}variant="outline-secondary">Logout</Button>
            </Col>
          </Row>
          </Container>
        </>
    )   
}

export default NavBar;