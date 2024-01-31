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
import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {MemoChart} from '../Components/Chart';
import Radar from '../Components/Radar';
import NavBar from '../Components/NavigationBar';
import { ListGroup } from 'react-bootstrap';

const Home = () => {

  const {logOut, user} = useUserAuth();
  
  const [local, setLocal] = useState(null);
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

  const navigate = useNavigate();

  const playerIDRef = useRef()

  const tableRef = useRef()

  const options = {
    method: 'GET',
	  headers: {
		'X-RapidAPI-Key': `${process.env.REACT_APP_RAPID_API_KEY}`,
		'X-RapidAPI-Host': "tank01-fantasy-stats.p.rapidapi.com"
	  }
  };
  
  useEffect(() => {
    const abortController = new AbortController();
    const arrayRange = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => start + index * step
    );
    const pages = arrayRange(4,52,1)
    const totalPlayers = [];
    const playerIDs = [];
    const getData = async () => {
     try { 
      const response = await Promise.all(
         pages.map( async i => {
           return await axios.get(`https://www.balldontlie.io/api/v1/players?page=${i}&per_page=100`, {signal: abortController.signal})
          }))           
       const activeResponse = await axios.get('https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams?schedules=true&rosters=true', options) 
       response.map(i => i.data.data.map(t => totalPlayers.push(t)))
       const obbject = activeResponse.data.body.map(i => i.Roster)  
       //const keys = []
       const objectArray = []
       //obbject.map(i => Object.keys(i)).forEach(i => i.map(t => keys.push(t)))
       obbject.map(i => Object.entries(i)).forEach((i) => objectArray.push(i));
       const names = objectArray.map(i => i.map(t => t[1].longName));
       const nameArray = []
      names.map(i => i.map(t => nameArray.push(t)));
      const headShotArray2 = []
      const headShotArray = objectArray.map(i => i.map(t => t[1])).map(e => e.map(t => headShotArray2.push(t)))
       const activePlayersFiltered = totalPlayers.filter(i => nameArray
      .includes(i.first_name + " " + i.last_name))
       activePlayersFiltered.map(i => playerIDs.push(i.id))
       const slicedArray_1 = playerIDs.slice(0, 200)
       const slicedArray_2 = playerIDs.slice(200, 600)
       const playerIDs_1 = slicedArray_1.map(i => `&player_ids[]=${i}`).join("") 
       const playerIDs_2 = slicedArray_2.map(i => `&player_ids[]=${i}`).join("") 
       const seasonResponse = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2023${playerIDs_1}`, {signal: abortController.signal})
       const seasonResponse_2 = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2023${playerIDs_2}`, {signal: abortController.signal})
       const seasonResponseFull = seasonResponse.data.data.concat(seasonResponse_2.data.data)
       console.log("SRF", seasonResponseFull)
       activePlayersFiltered.forEach(i => {i.avg = seasonResponseFull.filter(t => i.id === t.player_id)[0];
       i.headShot = headShotArray2.filter(t => (i.first_name + " " + i.last_name) === t.longName)[0].nbaComHeadshot
      })
       setLocal(activePlayersFiltered.filter(i => i.avg !== undefined))
     } catch (error) {
       if (error.response) {
         console.log(error.response.data);
         console.log(error.response.status);
         console.log(error.response.headers); 
       } else if (error.request) {
         console.log(error.request);
       } else {
        console.log(error.message);
       }
     }
   }
   getData();
   return () => abortController.abort();
  },[])
 
  useEffect(() => {
    if (localStorage.length === 0 || localStorage.players === "null" || !localStorage.players)
    localStorage.setItem("players", JSON.stringify(local))
  }, [local] )

  useEffect(() => {
   const localPlayers = JSON.parse(localStorage.getItem("players"))
   if (localPlayers) {
      setActivePlayers(localPlayers.filter(i => i.avg.games_played > 9))
   }
  }, [local]);
 
  useEffect(() => {
    const fetchRoster = async () => {
      if (user.uid) {
        const docRef = doc(firestore, "users", user.uid)
        const docSnap = await getDoc(docRef)
        setRoster(docSnap.data().roster)
        setUserName(docSnap.data().user)
    }}
    fetchRoster()
  },[user])

  useEffect(() => {
    playerIDRef.current = playerID
  })

  const deleteRoster = async (ID) => {
    const updatedRoster = roster.filter(i => i.id !== ID)
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
       <div className='main-container d-flex flex-column justify-content-center' >
       <style>
        {`
         @media only screen and (max-width: 768px) {
          .radar-container, .bar-container {
            padding: 0px;
          }
          .page-container {
            height: 160vh !important;
          }
          .row-container {
            row-gap: 7vh;
          }
          .main-container {
            height: 168vh;
          }
        }
        `}
        </style> 
        <Container className="" fluid>
          <Row className='mb-3 border bg-white' style={{height:"8vh", width:"100vw"}}>
            <NavBar position={position} setPosition={setPosition} onLogOut={onLogOut} userName={userName} show={show} setShow={setShow}/>
      </Row>
      </Container>
       <Container className='page-container position-relative' style={{backgroundColor:"#f8f8f8", height: "100vh", overflow:"hidden", width: "95%"}} fluid>
          <Row className="" style={{marginBottom: "1vh", overflow:"hidden", }}>
            <TableComponent tableRef={tableRef} showTable={showTable} setShowTable={setShowTable} position={position} setPosition={setPosition} setRoster={setRoster} roster={roster} sort={sort} setSort={setSort} activePlayers={activePlayers} playerFilter={playerFilter} handleChange={handleChange}/>
            <RosterDashboard getRef={tableRef} showTable={showTable} setShowTable={setShowTable} roster={roster} playerID={playerID} setPlayerID={setPlayerID} deleteRoster={deleteRoster} position={position} setPosition={setPosition}/>
          </Row>
           <Row className="row-container" style={{height: "58vh"}}>
            <Col md={6} className="radar-container ps-0"><Radar roster={roster} setPlayer={setPlayer} setPlayerID={setPlayerID} playerID={playerID} player={player}/></Col><Col md={6} className='bar-container pe-0' ><MemoChart chartType={chartType} setChartType={setChartType} activePlayers={activePlayers} roster={roster}/></Col>
          </Row>
      </Container>
      </div>
  )
}

export default Home;