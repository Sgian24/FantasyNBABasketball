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
          .info {
            height: 16px;
            width: 16px;
            background-image: url("${InfoCircle}");
            cursor: pointer;
          }
          
          .info:hover {
            background-image: url("${InfoCircleFill}")
          } 

          @media only screen and (max-width: 768px) {
            .nav-row {
              padding-right: 1rem;
            }
           }
          `}
        </style>
        <Container className="d-flex justify-content-center px-0" style={{width:"95%"}} fluid>
           <Row className="nav-row d-flex align-items-center " style={{height: "8vh", marginBottom: "2vh", width:"100%" }}>
            <Col className='d-flex gap-1 px-0'>
              <h5 style={{fontWeight:"normal"}}>Welcome,</h5>
              <h5 style={{color:"#456990"}}>{userName}</h5>
            </Col>
            <Col className="d-flex justify-content-end align-items-center gap-3 px-0 ">
              <div className="info" onClick={() => setShow(true)}></div>
              <Button onClick={onLogOut} type="submit" size="sm" style={{minWidth: "6vw", fontSize:"0.9rem"}}variant="primary">Log out</Button>
            </Col>
            <Modal show={show} onHide={() => setShow(false)}>
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