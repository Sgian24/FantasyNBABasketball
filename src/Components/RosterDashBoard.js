import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import { useEffect, useRef } from 'react';

const RosterDashboard = ({roster, deleteRoster, playerID, setPlayerID}) => {
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
      const onClick = (e) => {
      buttonRef.forEach(i => i?.classList.remove("active"))
      e.target.classList.add("active")
    }   
    if (buttonRef[0]) { 
      buttonRef.forEach(i => i?.addEventListener("click", (e) => onClick(e)))
      return () => buttonRef.forEach(i => i?.removeEventListener("click", (e) => onClick(e)))
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
            `}
        </style> 
        <Container className='overflow-auto d-flex align-items-center border' style={{height:"120px"}} fluid={true}>
         <Row className="d-flex flex-nowrap" >
         {roster.map((i, index) => 
          <Col key={i.id} className="dashboard d-flex align-items-center justify-content-center border gap-1" style={{height: "100px",width: "20vw"}}>
            <Col className='d-flex flex-column gap-2' style={{width: "3vw"}}>
              <Button size="sm" variant="outline-secondary" ref={element => statButton.current[index] = element} style={{fontSize: "2vh", fontWeight:"bold", width: "6vw"}} className='Stats-button' name={i.id}>VIEW</Button>
              <Button size="sm" variant="outline-danger" ref={element => waiveButton.current[index] = element} style={{fontSize: "2vh",  fontWeight:"bold", width: "6vw"}} className="Waive-button" name={i.id} >WAIVE</Button>
            </Col>
            <Col className="">
              <Image id="headshot" src={i.headShot} style={{height: "10vh", }} />
            </Col>
            <Col md={2}style={{width: "5vw", fontSize:"0.8em", fontWeight:"bold", overflowWrap: "break-word"}}>
              {i.first_name} <br></br>
              {i.last_name}
            </Col>
          </Col>
          )}
          </Row>    
        </Container>
      </>
  )
}

export default RosterDashboard;