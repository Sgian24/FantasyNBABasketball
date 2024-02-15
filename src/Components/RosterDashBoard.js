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
                min-width: 6vw ;
                font-size: 10px !important;
              }
              .Waive-button {
                min-width: 6vw ;
                font-size: 10px !important;
              }
           }

             @media only screen and (max-width: 768px) {
              .roster-row {
                width: 33.3% !important ;
              }
              .headshot-column {
                padding-left: 3vw !important ;
                width: 14vw !important;
              }
             }
            
             @media only screen and (max-width: 576px) {
              .roster-row {
                width: 50% !important;
              }
              .player-names {
                width: 15vw !important;
              }
              .headshot-column {
                padding-left: 4vw !important ;
                width: 21vw !important;
              }
              .Waive-button {
                min-width: 17vw !important ;
                font-size: 8px ;
              }
              .Stats-button {
                min-width: 17vw !important ;
                font-size: 8px ;
              }
            }
             .dashboard:hover {
                background-color: #00000013;
             }
            
             @media only screen and (max-width: 376px) {
               .player-names {
                font-size: 0.6em !important;
               }
               .headshot-column {
                padding-left: 1vw !important ;
                width: 21vw !important;
              }
              .Waive-button {
                min-width: 20vw !important ;
                font-size: 8px ;
              }
              .Stats-button {
                min-width: 20vw !important ;
                font-size: 8px ;
              }
             }
            `}
        </style>
       <div className='d-flex p-0 mb-2 gap-3'>
        <h5 className="p-0 pt-2 " style={{lineHeight:"0.2"}}>Roster</h5>
        <Button className="draft-button" size="sm"  variant="outline-primary" style={{height: "4vh", minWidth:"4vw", fontSize:"0.65rem"}}>DRAFT</Button>
       </div>
        <Container className='d-flex align-items-center bg-white p-0 rounded ' style={{height:"22vh", overflowY:"hidden"}} fluid >
         <Row className="d-flex flex-nowrap gx-0 p-0 w-100 h-100 rounded">
          <p className='text-center opacity-50 mt-5' style={{display: roster.length === 0? "block": "none"}}>Click draft to start adding players to your roster.</p>
         {roster.map((i, index) => 
         <Row className="roster-row w-25 gx-0" style={{height:"100%"}}>
          
          <Row lang="en"key={i.id} className='dashboard d-flex align-items-center justify-content-center px-2 border gx-0 gap-0' style={{height:"100%",width:"100%"}}>
            <Row className=" d-flex align-items-end px-0 gap-1">
            <Col sm={6} lg={6} className="headshot-column ps-3 mt-1" style={{width:"50%"}}>
              <Image id="headshot" src={i.headShot} style={{height: "10vh", }} />
            </Col>
            <Col sm={6} lg={6}className="player-names px-0"   style={{width: "10vw", fontSize:"0.8em", fontWeight:"bold", overflowWrap: "break-word", hyphens:"manual", }}>
              {i.first_name} <br></br>
             {i.last_name.length > 7? i.last_name.slice(0,7): i.last_name}&shy;{i.last_name.length > 7? i.last_name.slice(7):""}
            </Col>
            </Row>
            <Row className='w-100 px-0'>
            <Col className='d-flex flex-row justify-content-center gap-1 w-100 mb-2'>
              <Button size="sm" variant="outline-secondary" ref={element => statButton.current[index] = element} style={{fontSize: "2vh", fontWeight:"bold", minWidth: "10vw"}} className='Stats-button' name={i.id}>VIEW</Button>
              <Button size="sm" variant="outline-danger" ref={element => waiveButton.current[index] = element} style={{fontSize: "2vh",  fontWeight:"bold", minWidth: "10vw"}} className="Waive-button" name={i.id} >WAIVE</Button>
            </Col>
            </Row>
          </Row>
          
          </Row>
          )}
          </Row>    
        </Container>
      </div>
  )
}

export default RosterDashboard;