import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import { useEffect, useRef } from 'react';

const RosterDashboard = ({roster, deleteRoster, setPlayerID}) => {
  const statButton = useRef([]);
  const buttonRef = statButton.current;
  const waiveButton = useRef([])
  const waiveButtonRef = waiveButton.current;

  useEffect(() => {   
    if (buttonRef[0]) { 
      buttonRef.forEach(i => i?.addEventListener("click", () => setPlayerID(Number(i.name))))
      return () => buttonRef.forEach(i => i?.removeEventListener("click", () => setPlayerID(Number(i.name))))
      }
    },[roster])
    
  useEffect(() => {
       if (waiveButtonRef[0]) {
      waiveButtonRef.forEach(i => i?.addEventListener("click", () => deleteRoster(Number(i.name))))
      return () => waiveButtonRef.forEach(i => i?.removeEventListener("click", () => deleteRoster(Number(i.name))))
      }
    },[roster])

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
             .Stats-button, .Waive-button {
              background-color: #088395;
             }
             .Stats-button:hover, .Waive-button:hover {
              background-color: #065e6b;
             }
            `}
        </style> 
        <Container className='overflow-auto border' style={{height:"500px"}} fluid={true}>
         {roster.map((i, index) => 
          <Row key={i.id} className="dashboard d-flex align-items-center border" style={{height: "100px"}}>
            <Col md={3} >
              <Image id="headshot" src={i.headShot} fluid/>
            </Col>
            <Col className="player-name" md={5}>
              {i.first_name + " " + i.last_name}
            </Col>
            <Col >
            <Button ref={element => statButton.current[index] = element} className='Stats-button' name={i.id}>Stats</Button>
            </Col>
            <Col>
            <Button ref={element => waiveButton.current[index] = element} className="Waive-button" name={i.id} >Waive</Button>
            </Col>
          </Row>
          )}    
        </Container>
      </>
  )
}

export default RosterDashboard;