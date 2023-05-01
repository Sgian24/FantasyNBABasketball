import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const RosterDashboard = ({roster, deleteRoster}) => {
    return (
        <Container>
        <Row>
          <Col>
          {roster.map(i => <p>{i.first_name + i.last_name}<button onClick={() => deleteRoster(i.id)}>Waive</button></p>)}    
          </Col>
          <Col></Col>  
        </Row>    
        </Container>
    )
}

export default RosterDashboard;