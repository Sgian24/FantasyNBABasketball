import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableComponent from '../Components/Table';

const Home = ({sort, setSort, activePlayers, playerFilter, handleChange}) => {
    return (
       <>
       <Container>
          <Row>
            <Col>NBA Player Tracker</Col>
          </Row>
          <Row>
            <Col><TableComponent sort={sort} setSort={setSort} activePlayers={activePlayers} playerFilter={playerFilter}handleChange={handleChange}/></Col>
          </Row>
      </Container>
      </>
    )
}

export default Home;