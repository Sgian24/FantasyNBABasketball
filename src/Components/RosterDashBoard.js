import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import { useEffect, useRef } from 'react';

const RosterDashboard = ({roster, deleteRoster, setPlayerID, position, setPosition}) => {
  const statButton = useRef([]);
  const buttonRef = statButton.current;
  const waiveButton = useRef([])
  const waiveButtonRef = waiveButton.current;

  useEffect(() => {
      const onClick = (e, id) => {
      buttonRef.forEach(i => i?.classList.remove("active"))
      e.target.classList.add("active")
      setPlayerID(Number(id))
    }   
    if (buttonRef[0]) { 
      buttonRef.forEach(i => i?.addEventListener("click", (e) => onClick(e, i.name)))
      return () => buttonRef.forEach(i => i?.removeEventListener("click", (e) => onClick(e, i.name)))
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
       <div className='d-flex p-0 gap-3'>
        <h3 className="p-0">Roster</h3>
        <Button onClick={() => setPosition(position === 1280? 565: 1280)} size="sm" variant="primary" style={{height: "5vh", width:"5vw"}}>Draft</Button>
       </div> 
        <Container className='d-flex align-items-center bg-white p-0 rounded' style={{height:"17vh", overflowY:"hidden"}} >
         <Row className="d-flex flex-nowrap gx-0 p-0 w-100 rounded">
         {roster.map((i, index) => 
         <Row className="w-25 gx-0">
          <Col key={i.id} className='dashboard d-flex align-items-center justify-content-center px-2 border  ' style={{height:"17vh",width:"22.26vw"}} >
            
            <Col md={4}className='d-flex flex-column gap-2 '>
              <Button size="sm" variant="outline-secondary" ref={element => statButton.current[index] = element} style={{fontSize: "2vh", fontWeight:"bold", width: "6vw"}} className='Stats-button' name={i.id}>VIEW</Button>
              <Button size="sm" variant="outline-danger" ref={element => waiveButton.current[index] = element} style={{fontSize: "2vh",  fontWeight:"bold", width: "6vw"}} className="Waive-button" name={i.id} >WAIVE</Button>
            </Col>
            <Col md={4}className="">
              <Image id="headshot" src={i.headShot} style={{height: "10vh", }} />
            </Col>
            <Col md={4} style={{width: "5vw", fontSize:"0.8em", fontWeight:"bold", overflowWrap: "break-word"}}>
              {i.first_name} <br></br>
              {i.last_name}
            </Col>
          </Col>
          </Row>
          )}
          </Row>    
        </Container>
      </>
  )
}

export default RosterDashboard;