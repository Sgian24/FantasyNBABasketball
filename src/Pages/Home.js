import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import TableComponent from '../Components/Table';
import RosterDashboard from '../Components/RosterDashBoard';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../UserAuthContext';
import { firestore } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useEffect, useState, useRef } from 'react';
import {MemoChart} from '../Components/Chart';
import Radar from '../Components/Radar';
import NavBar from '../Components/NavigationBar';
import Spinner from 'react-bootstrap/Spinner';

const Home = () => {

  const {logOut, user} = useUserAuth();
  
  const [activePlayers, setActivePlayers] = useState([]);
  const [sort, setSort] = useState("PPG");
  const [playerFilter, setPlayerFilter] = useState("");
  const [roster, setRoster] = useState([]);
  const [playerID, setPlayerID] = useState("");
  const [player, setPlayer] = useState({})
  const [chartType, setChartType] = useState("pts")
  const [position, setPosition] = useState("100%")
  const [showTable, setShowTable] = useState(false)
  const [userName, setUserName] = useState("");
  const [show, setShow] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();

  const playerIDRef = useRef()

  const tableRef = useRef()

  const options = {
    method: 'GET',
    params: {
      schedules: 'false',
      rosters: 'true',
      statsToGet: 'averages',
    },
	  headers: {
		'X-RapidAPI-Key': `${process.env.REACT_APP_RAPID_API_KEY}`,
		'X-RapidAPI-Host': "tank01-fantasy-stats.p.rapidapi.com"
	  }
  };

  
  useEffect(() => {
    const fetchData = async () => {
      const players = []
      try {
        const response = await axios.get('https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams',options)
        response.data.body.forEach(i => {
          for (const [key, value] of Object.entries(i.Roster)) {
            players.push(value);
        }})
        setActivePlayers(players);
      } catch (error) {
        if (error) console.log(error);
      }
    }
    fetchData()
  },[])

  useEffect(() => {
    const fetchRoster = async () => {
      if (user.uid && activePlayers.length > 0 ) {
        const docRef = doc(firestore, "users", user.uid)
        const docSnap = await getDoc(docRef)
        const rosterIDs = [].concat(docSnap.data().roster?.map(i => i?.playerID))
        const updatedRoster = activePlayers.filter(i => rosterIDs.includes(i?.playerID))
        await updateDoc(docRef, {
          roster: updatedRoster
        })
        setUserName(docSnap.data().user)
        setRoster(updatedRoster)
        setLoading(false)
    }}
    fetchRoster()
 },[user.uid, activePlayers])

  useEffect(() => {
    playerIDRef.current = playerID
  })

  const deleteRoster = async (ID) => {
    const updatedRoster = roster.filter(i => i.playerID !== ID)
    const rosterRef = doc(firestore, "users", user.uid)
    await updateDoc(rosterRef, {
      roster: updatedRoster
    })
    const docSnap = await getDoc(rosterRef)
    setRoster(docSnap.data().roster)
    if (playerIDRef.current === ID) {
      setPlayerID(12345)
    }

  }
  
  const handleChange = (event) => {
    setPlayerFilter(event.target.value)
  }
 
  const onLogOut = async () => {
      try {
        await logOut();
        navigate("/");
      } catch (err) {
        console.log(err.message);
      }
  } 

  return (
       <div className='main-container position-relative h-auto w-100 d-flex flex-column justify-content-center align-items-center' >
        <Container className="nav-container" fluid>
          <Row className='nav-container-row mb-3 border bg-white'>
            <NavBar position={position} setPosition={setPosition} onLogOut={onLogOut} userName={userName} show={show} setShow={setShow}/>
          </Row>
        </Container>
        <div className="loading-spinner d-flex justify-content-center align-items-center position-absolute w-100 bg-black" style={{visibility:loading? "visible":"hidden"}}>
          <Spinner className="spinner" animation='border' variant='light'/>
        </div>
       <Container className='page-container h-auto overflow-hidden' fluid>
          <Row className="page-container-row overflow-hidden">
            <RosterDashboard getRef={tableRef} showTable={showTable} setShowTable={setShowTable} roster={roster} playerID={playerID} setPlayerID={setPlayerID} deleteRoster={deleteRoster} position={position} setPosition={setPosition}/>
          </Row>
          <Row className="row-container position-relative h-auto mb-2 ">
            <Col md={6} className="radar-container ps-0 ">
              <TableComponent tableRef={tableRef} showTable={showTable} setShowTable={setShowTable} showAlert={showAlert} setShowAlert={setShowAlert} position={position} setPosition={setPosition} setRoster={setRoster} roster={roster} sort={sort} setSort={setSort} activePlayers={activePlayers} playerFilter={playerFilter} handleChange={handleChange}/>
              <Radar roster={roster} setPlayer={setPlayer} setPlayerID={setPlayerID} playerID={playerID} player={player}/>
            </Col>
            <Col md={6} className='bar-container pe-0 h-auto' >
              <MemoChart chartType={chartType} setChartType={setChartType} activePlayers={activePlayers} roster={roster}/>
            </Col>
          </Row>
          <Row>
            <Col className=' px-0'>
              <span className="footer-text">Designed and developed by Sunny Gian.</span>
            </Col>
          </Row>
         
      </Container>
      </div>
  )
}

export default Home;