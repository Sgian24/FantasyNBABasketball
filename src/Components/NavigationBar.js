import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import InfoCircle from "../Assets/info-circle.svg";
import InfoCircleFill from "../Assets/info-circle-fill.svg";
import Modal from 'react-bootstrap/Modal';

const NavBar = ({onLogOut, show, setShow, userName}) => {
  
    return (
        <div className='px-0'>
        <style type="text/css">
          {`  
          .info:hover {
            background-image: url("${InfoCircleFill}") !important;
          } 
          `}
        </style>
        <Container className="margin-container d-flex justify-content-center px-0" fluid>
           <Row className="nav-row w-100 d-flex align-items-center">
           <Col className='d-flex gap-1 px-0'>
              <h5>Welcome,</h5>
              <h5 className='username'>{userName}</h5>
            </Col>
            <Col className="d-flex justify-content-end align-items-center gap-3 px-0 ">
              <div className="info" style={{backgroundImage:`url("${InfoCircle}")`}} onClick={() => setShow(true)}></div>
              <Button className="signout-button" onClick={onLogOut} type="submit" size="sm" variant="primary">Sign out</Button>
            </Col>
            <Modal className="mt-5" show={show} onHide={() => setShow(false)}>
              <Modal.Header closeButton>
                <Modal.Title>About</Modal.Title>  
              </Modal.Header>
              <Modal.Body>Click <strong>draft</strong> to start adding players onto your roster. Click <strong>view</strong> to see the selected player's 
                per game stats on the radar chart. The bar chart displays the roster's per game stats. To remove a player from your roster click <strong>waive</strong>.
              </Modal.Body>
            </Modal>
          </Row>
          </Container>
      </div>
    )   
}

export default NavBar;