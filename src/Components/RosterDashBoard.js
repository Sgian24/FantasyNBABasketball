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
      if (!showTable && window.innerWidth > 1400) {
        getRef.current.style.setProperty("right", "50.5%")
      } else if (!showTable && window.innerWidth > 769 && window.innerWidth < 1400) {
          getRef.current.style.setProperty("right", "51%")
      } else if (showTable && window.innerWidth > 769) {
        getRef.current.style.setProperty("right", "100%") 
      } else if (!showTable && window.innerWidth < 769) {
        getRef.current.style.setProperty("right", "0%")
      } else if (showTable && window.innerWidth < 769) {
        getRef.current.style.setProperty("right", "100%")
      }}
     const button = document.getElementsByClassName("dashboard-draft-button")[0]
     button.addEventListener("click", onClick)
     return () => button.removeEventListener("click", onClick)  
    },[showTable]) 

  return (
       <div className='px-0'>
       <div className='d-flex align-items-center p-0 mb-2 gap-3'>
        <h5 className="p-0 pt-1 ">Roster</h5>
        <Button className="dashboard-draft-button h-50" size="sm"  variant="outline-primary">DRAFT</Button>
       </div>
        <Container className='h-auto overflow-y-hidden d-flex align-items-center bg-white px-0 rounded ' fluid >
         <Row className="d-flex flex-nowrap gx-0 p-0 w-100 h-100 rounded">
          <p className='text-center opacity-50 mt-5' style={{display: roster.length === 0? "block": "none"}}>Click draft to start adding players to your roster.</p>
          {roster.map((i, index) => 
            <Row className="roster-row w-25 gx-0 h-100">
            <Row lang="en"key={i.id} className='h-100 w-100 dashboard d-flex align-items-center justify-content-center px-2 border gx-0 gap-0'>
            <Row className="headshot-name-row d-flex align-items-end px-0 gap-1 mb-xl-0 mb-xxl-1">
            <Col sm={6} lg={6} className="headshot-column w-50 ps-4 mb-1 mb-sm-1 mb-xxl-0 mt-1">
              <Image className="object-fit-contain w-75" id="headshot" src={i.headShot} />
            </Col>
            <Col sm={6} lg={6} className="player-names px-0 mb-1 mb-sm-1 mb-xxl-0" >
              {i.first_name} <br></br>
             {i.last_name.length > 7? i.last_name.slice(0,7): i.last_name}&shy;{i.last_name.length > 7? i.last_name.slice(7):""}
            </Col>
            </Row>
            <Row className='w-100 px-0'>
            <Col className='d-flex flex-row justify-content-center gap-1 w-100 mb-2'>
              <Button size="sm" variant="outline-secondary" ref={element => statButton.current[index] = element}  className='Stats-button' name={i.id}>VIEW</Button>
              <Button size="sm" variant="outline-danger" ref={element => waiveButton.current[index] = element}  className="Waive-button" name={i.id} >WAIVE</Button>
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