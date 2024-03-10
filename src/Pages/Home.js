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
  const [showAlert, setShowAlert] = useState(false);

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

  const options2 = {
	  headers: {
		'Authorization': `${process.env.REACT_APP_BALLDONTLIE_API_KEY}`
	  }
  };
  
  useEffect(() => {
    const pages = [0,100,200,300,400,666400,666809,3547272,4196965,17895693,17895984,17896113,38017722,56677582]
    const getData = async () => {
     try { 
      const response = await Promise.all(
        pages.map(async i => {
          return await axios.get(`https://api.balldontlie.io/v1/players?&per_page=100&cursor=${i}`, options2)
        }))
       const activeResponse = await axios.get('https://tank01-fantasy-stats.p.rapidapi.com/getNBATeams?schedules=true&rosters=true', options) 
       const totalPlayers = []
       const objectArray = []
       const playerIDs = []
       const nameArray = []
       const headShotArray = []
       response.map(i => i.data.data.map(t => totalPlayers.push(t)))
       const playerObject = activeResponse.data.body.map(i => i.Roster)   
       playerObject.map(i => Object.entries(i)).forEach((i) => objectArray.push(i));
       const names = objectArray.map(i => i.map(t => t[1].longName)); 
       names.map(i => i.map(t => nameArray.push(t)));
       objectArray.map(i => i.map(t => t[1])).map(e => e.map(t => headShotArray.push(t)))
       const activePlayersFiltered = totalPlayers.filter(i => nameArray
        .includes(i.first_name + " " + i.last_name))
       activePlayersFiltered.map(i => playerIDs.push(i.id))
       const playerIdParams = playerIDs.map(i => `&player_ids[]=${i}`).join("")

       const seasonResponse = await axios.get(`https://api.balldontlie.io/v1/season_averages?season=2023${playerIdParams}`, options2)
       
       activePlayersFiltered.forEach(i => {i.avg = seasonResponse.data.data.filter(t => i.id === t.player_id)[0];
       i.headShot = headShotArray.filter(t => (i.first_name + " " + i.last_name) === t.longName)[0].nbaComHeadshot
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
  },[])
  
  useEffect(() => {
    if (local && localStorage.length === 0 || local && localStorage.players === "null" || local && !localStorage.players) {
    const now = new Date();
    const data = {
      value: local,
      expiry: now.getTime() + 86400000
    }
    localStorage.setItem("players", JSON.stringify(data))
    } 
  }, [local] )
    
  useEffect(() => {  
   const localPlayers = JSON.parse(localStorage.getItem("players"))
   const now = new Date()
   if (localPlayers){
    if (now.getTime() > localPlayers.expiry) {
       localStorage.removeItem("players") 
      } else {
      setActivePlayers(localPlayers.value?.filter(i => i.avg.games_played > 9))
   }}
  }, [local, localStorage]);

  useEffect(() => {
    const fetchRoster = async () => {
      if (user.uid && activePlayers.length > 0 ) {
        const docRef = doc(firestore, "users", user.uid)
        const docSnap = await getDoc(docRef)
        const rosterIDs = [].concat(docSnap.data().roster.map(i => i?.id))
        const updatedRoster = activePlayers.filter(i => rosterIDs.includes(i?.id))
        await updateDoc(docRef, {
          roster: updatedRoster
        })
        setUserName(docSnap.data().user)
        setRoster(updatedRoster)
    }}
    fetchRoster()
 },[user, activePlayers])

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
       <div className='main-container d-flex flex-column justify-content-center align-items-center' >
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
        <Container className="" style={{height: "9vh"}} fluid>
          <Row className='mb-3 border bg-white' style={{height:"8vh", width:"100vw"}}>
            <NavBar position={position} setPosition={setPosition} onLogOut={onLogOut} userName={userName} show={show} setShow={setShow}/>
      </Row>
      </Container>
       <Container className='page-container position-relative' style={{backgroundColor:"#f8f8f8", height: "100vh", overflow:"hidden", width: "95%"}} fluid>
          <Row className="" style={{marginBottom: "1vh", overflow:"hidden", }}>
            <TableComponent tableRef={tableRef} showTable={showTable} setShowTable={setShowTable} showAlert={showAlert} setShowAlert={setShowAlert} position={position} setPosition={setPosition} setRoster={setRoster} roster={roster} sort={sort} setSort={setSort} activePlayers={activePlayers} playerFilter={playerFilter} handleChange={handleChange}/>
            <RosterDashboard getRef={tableRef} showTable={showTable} setShowTable={setShowTable} roster={roster} playerID={playerID} setPlayerID={setPlayerID} deleteRoster={deleteRoster} position={position} setPosition={setPosition}/>
          </Row>
           <Row className="row-container" style={{height: "56vh"}}>
            <Col md={6} className="radar-container ps-0"><Radar roster={roster} setPlayer={setPlayer} setPlayerID={setPlayerID} playerID={playerID} player={player}/></Col><Col md={6} className='bar-container pe-0' ><MemoChart chartType={chartType} setChartType={setChartType} activePlayers={activePlayers} roster={roster}/></Col>
          </Row>
      </Container>
      </div>
  )
}

export default Home;