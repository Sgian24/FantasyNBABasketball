import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import InfoCircle from "../Assets/info-circle.svg";
import InfoCircleFill from "../Assets/info-circle-fill.svg";
import Modal from 'react-bootstrap/Modal';

const NavBar = ({onLogOut, show, setShow, userName}) => {

    return (
        <>
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
          `}

        </style>
        <Container fluid>
           <Row style={{height: "8vh", marginBottom: "2vh", paddingLeft: "4vw", paddingRight: "4.5vw", }}className="d-flex align-items-center bg-white" >
            <Col className='d-flex gap-1' md={8} style={{ paddingLeft: "1.5vw", }}>
              <h5 style={{fontWeight:"normal"}}>Welcome,</h5>
              <h5 style={{color:"#456990"}}>{userName}</h5>
            </Col>
            
            <Col className="d-flex justify-content-end align-items-center gap-3">
              <div className="info" onClick={() => setShow(true)}></div>
              <Button onClick={onLogOut} type="submit" size="sm" style={{width: "6vw", marginRight:"0.2vw"}}variant="primary">Log out</Button>
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
        </>
    )   
}

export default NavBar;