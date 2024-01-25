import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from 'react-bootstrap/Button';
import { useEffect, useRef } from 'react';

const RosterDashboard = ({getRef, roster, deleteRoster, setPlayerID, showTable, setShowTable}) => {
  
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

  useEffect(() => {
    const onClick = () => {
      setShowTable(!showTable? true: false)
      if (!showTable && window.innerWidth > 769) {
          getRef.current.style.setProperty("right", "51%")
      } else if (showTable && window.innerWidth > 769) {
        getRef.current.style.setProperty("right", "100%") 
      } else if (!showTable && window.innerWidth < 769) {
        getRef.current.style.setProperty("right", "0%")
      } else if (showTable && window.innerWidth < 769) {
        getRef.current.style.setProperty("right", "100%")
      }}
     const button = document.getElementsByClassName("draft-button")[0]
     button.addEventListener("click", onClick)
     return () => button.removeEventListener("click", onClick)  
    },[showTable]) 

  return (
        <div className='px-0'>
         <style type="text/css">
            {`
            @media only screen and (max-width: 992px) {
              .player-names {
                  font-size: 0.65em !important;
              }
              #headshot {
                height: 8vh !important;
              }
              .Stats-button {
                min-width: 6vw !important;
                font-size: 10px !important;
              }
              .Waive-button {
                min-width: 6vw !important;
                font-size: 10px !important;
              }
           }

             @media only screen and (max-width: 768px) {
              .roster-row {
                width: 33.3% !important;
              }
              .headshot-column {
                padding-left: 0px !important;
              }
              .player-names {
                width: 7vw !important;
              }
             }
            
             @media only screen and (max-width: 576px) {
              .roster-row {
                width: 50% !important;
              }
              .player-names {
                width: 10vw !important;
              }
              .Waive-button {
                min-width: 5vw !important;
                font-size: 8px !important;
              }
              .Stats-button {
                min-width: 5vw !important;
                font-size: 8px !important;
              }
            }
             .dashboard:hover {
                background-color: #00000013;
             }
            `}
        </style>
       <div className='d-flex p-0 mb-2 gap-3'>
        <h5 className="p-0 pt-2 " style={{lineHeight:"0.2"}}>Roster</h5>
        <Button className="draft-button" size="sm"  variant="outline-primary" style={{height: "4vh", minWidth:"4vw", fontSize:"0.65rem"}}>DRAFT</Button>
       </div>
        <Container className='d-flex align-items-center bg-white p-0 rounded border' style={{height:"17vh", overflowY:"hidden"}} fluid >
         <Row className="d-flex flex-nowrap gx-0 p-0 w-100 rounded">
          <p className='text-center opacity-50' style={{display: roster.length === 0? "block": "none"}}>Click draft to start adding players to your roster.</p>
         {roster.map((i, index) => 
         <Row className="roster-row w-25 gx-0">
          <Col lang="en"key={i.id} className='dashboard d-flex align-items-center justify-content-center px-2 border' style={{height:"17vh",width:"22.26vw"}}>
              <Col sm={3} md={3} lg={3} className='d-flex flex-column gap-2 w-25'>
              <Button size="sm" variant="outline-secondary" ref={element => statButton.current[index] = element} style={{fontSize: "2vh", fontWeight:"bold", minWidth: "4vw"}} className='Stats-button' name={i.id}>VIEW</Button>
              <Button size="sm" variant="outline-danger" ref={element => waiveButton.current[index] = element} style={{fontSize: "2vh",  fontWeight:"bold", minWidth: "4vw"}} className="Waive-button" name={i.id} >WAIVE</Button>
            </Col>
            <Col sm={4} md={5} lg={5} className="headshot-column ps-3">
              <Image id="headshot" src={i.headShot} style={{height: "10vh", }} />
            </Col>
            <Col className="player-names" sm={5} md={4} lg={4} style={{width: "5vw", fontSize:"0.8em", fontWeight:"bold", overflowWrap: "break-word", hyphens:"manual"}}>
              {i.first_name} <br></br>
             {i.last_name.length > 7? i.last_name.slice(0,7): i.last_name}&shy;{i.last_name.length > 7? i.last_name.slice(7):""}
            </Col>
          </Col>
          </Row>
          )}
          </Row>    
        </Container>
      </div>
  )
}

export default RosterDashboard;