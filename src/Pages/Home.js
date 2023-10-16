import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
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
  const [position, setPosition] = useState(-1000)

  const navigate = useNavigate();

  const refTest = useRef()

  const options = {
    method: 'GET',
	  headers: {
		'X-RapidAPI-Key': `${process.env.REACT_APP_RAPID_API_KEY}`,
		'X-RapidAPI-Host': "nba-player-individual-stats.p.rapidapi.com"
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
       
       const activeResponse = await axios.get('https://nba-player-individual-stats.p.rapidapi.com/players', options) 
      
       response.map(i => i.data.data.map(t => totalPlayers.push(t)))

       /* NBA free agents that switched teams had incomplete data*/
       const freeAgents = ["Fred", "Dillon", "Donte", "Bruce", "Gabe", "Dennis", "Eric", "Lonnie", "OG"]
       const freeAgentHeadShots = [{Name:"Fred",
                            headShot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/2991230.png"},
                           {Name:"Dillon",
                            headShot: "https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3155526.png"}, 
                           {Name:"Donte",
                            headShot:"https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3934673.png"}, 
                           {Name:"Bruce",
                            headshot:"https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4065670.png"}, 
                           {Name:"Gabe",
                            headShot:"https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3137259.png"}, 
                           {Name:"Dennis",
                            headShot:"https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3032979.png"},  
                           {Name:"Eric",
                            headShot:"https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3431.png"}, 
                           {Name:"Lonnie",
                            headShot:"https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/4277890.png"},
                            {Name:"OG",
                            headShot:"https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/3934719.png"} 
                           ]

       const activePlayersFiltered = totalPlayers.filter(i => activeResponse.data
        .filter(i => i.team !== null || freeAgents.includes(i.firstName))
        .map(i => i.firstName + i.lastName)
        .includes(i.first_name + i.last_name) && i.id !== 448)
        
        // Gary Trent Jr is included a second time with a different id(448) hence the filter 
       activePlayersFiltered.map(i => playerIDs.push(i.id))
       const slicedArray_1 = playerIDs.slice(0, 200)
       const slicedArray_2 = playerIDs.slice(200, 600)
       const playerIDs_1 = slicedArray_1.map(i => `&player_ids[]=${i}`).join("") 
       const playerIDs_2 = slicedArray_2.map(i => `&player_ids[]=${i}`).join("") 
       const seasonResponse = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2022${playerIDs_1}`, {signal: abortController.signal})
       const seasonResponse_2 = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2022${playerIDs_2}`, {signal: abortController.signal})
       const seasonResponseFull = seasonResponse.data.data.concat(seasonResponse_2.data.data)
       console.log(seasonResponseFull)
       activePlayersFiltered.forEach(i => {i.avg = seasonResponseFull.filter(t => i.id === t.player_id)[0];
        i.headShot = freeAgents.includes(i.first_name)? freeAgentHeadShots.filter(t => t.Name === i.first_name)[0]?.headShot: 
        activeResponse.data.filter(t => (i.first_name + i.last_name).includes(t.firstName + t.lastName))[0].headShotUrl
      })
       setLocal(activePlayersFiltered.filter(i => i.avg !== undefined))
       console.log("locall", activePlayersFiltered.filter(i => i.first_name === "OG"));
       console.log(freeAgentHeadShots);
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
    }}
    fetchRoster()
  },[user])

  useEffect(() => {
    refTest.current = playerID
  })

  const deleteRoster = async (ID) => {
    const updatedRoster = roster.filter(i => i.id !== ID)
    const rosterRef = doc(firestore, "users", user.uid)
    await updateDoc(rosterRef, {
      roster: updatedRoster
    })
    const docSnap = await getDoc(rosterRef)
    setRoster(docSnap.data().roster)
    if (refTest.current === ID) {
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
       <div>
       <NavBar position={position} setPosition={setPosition} onLogOut={onLogOut}/>
       <Container>
          <Row style={{marginBottom: "5vh"}}>
            <TableComponent position={position} setRoster={setRoster} roster={roster} sort={sort} setSort={setSort} activePlayers={activePlayers} playerFilter={playerFilter} handleChange={handleChange}/>
            <RosterDashboard roster={roster} playerID={playerID} setPlayerID={setPlayerID} deleteRoster={deleteRoster}/>
          </Row>
          <Row className="border" style={{marginBottom: "4vh", height: 350}}>
            <Col md="6"><MemoChart chartType={chartType} setChartType={setChartType} activePlayers={activePlayers} roster={roster}/></Col><Col md="6"><Radar roster={roster} setPlayer={setPlayer} setPlayerID={setPlayerID} playerID={playerID} player={player}/></Col>
          </Row>
      </Container>
      </div>
  )
}

export default Home;