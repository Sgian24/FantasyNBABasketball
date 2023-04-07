import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import TableComponent from '../Components/Table';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../UserAuthContext';

const Home = ({sort, setSort, activePlayers, playerFilter, handleChange}) => {

    const {logOut} = useUserAuth();
    
    const navigate = useNavigate();

    const onLogOut = async () => {
      try {
        await logOut();
        navigate("/");
      } catch (err) {
        console.log(err.message);
      }
    } 

    return (
       <>
       <Container>
          <Row>
            <Col>NBA Player Tracker</Col>
          </Row>
          <Row>
            <Col><TableComponent sort={sort} setSort={setSort} activePlayers={activePlayers} playerFilter={playerFilter}handleChange={handleChange}/></Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={onLogOut} variant="primary" type="submit">Sign out</Button>
            </Col>
          </Row>
      </Container>
      </>
    )
}

export default Home;