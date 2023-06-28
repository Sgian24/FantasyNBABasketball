import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';

const RosterDashboard = ({roster, deleteRoster}) => {

    return (
        <>
         <style type="text/css">
            {`
             @media only screen and (max-width: 765px) {
                #headshot {
                    height: 10vh;
                }
             }
             .dashboard:hover {
                background-color: #00000013;
             }
             .Dashboard-button {
              background-color: #088395;
             }
             .Dashboard-button:hover {
              background-color: #065e6b;
             }
            `}

        </style>
        <Container className='overflow-auto border' style={{height:"500px"}} fluid={true}>
          {roster.map(i => 
          <Row className="dashboard d-flex align-items-center border" style={{height: "100px"}}>
            <Col md={3} >
              <Image id="headshot" src={i.headShot} fluid/>
            </Col>
            <Col md={5}>
              {i.first_name + " " + i.last_name}
            </Col>
            <Col >
            <Button className='Dashboard-button'>Stats</Button>
            </Col>
            <Col>
            <Button className="Dashboard-button" onClick={() => deleteRoster(i.id)}>Waive</Button>
            </Col>
          </Row>
          )}    
        </Container>
        </>
    )
}

export default RosterDashboard;