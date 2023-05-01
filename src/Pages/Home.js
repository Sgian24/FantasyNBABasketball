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
import { useEffect, useState } from 'react';

const Home = () => {

  const {logOut, user} = useUserAuth();
  
  const [local, setLocal] = useState(null);
  const [activePlayers, setActivePlayers] = useState([]);
  const [sort, setSort] = useState("PPG");
  const [playerFilter, setPlayerFilter] = useState("");
  const [localRoster, setLocalRoster] = useState([]);
  const [roster, setRoster] = useState([]);

  const navigate = useNavigate();
  
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
       const activePlayersFiltered = totalPlayers.filter(i => activeResponse.data
        .filter(i => i.team !== null)
        .map(i => i.firstName + i.lastName)
        .includes(i.first_name + i.last_name) && i.id !== 448)
        // Gary Trent Jr is included a second time with a different id(448) hence the filter 
       activePlayersFiltered.map(i => playerIDs.push(i.id))
       const slicedArray_1 = playerIDs.slice(0, 460)
       const slicedArray_2 = playerIDs.slice(461, 508)
       const playerIDs_1 = slicedArray_1.map(i => `&player_ids[]=${i}`).join("") 
       const playerIDs_2 = slicedArray_2.map(i => `&player_ids[]=${i}`).join("") 
       const seasonResponse = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2022${playerIDs_1}`, {signal: abortController.signal})
       const seasonResponse_2 = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2022${playerIDs_2}`, {signal: abortController.signal})
       const seasonResponseFull = seasonResponse.data.data.concat(seasonResponse_2.data.data)
       activePlayersFiltered.forEach(i => i.avg = seasonResponseFull.filter(t => i.id === t.player_id)[0]) 
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
      setActivePlayers(localPlayers)
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

  const deleteRoster = async (playerID) => {
    const updatedRoster = roster.filter(i => i.id !== playerID)
    const rosterRef = doc(firestore, "users", user.uid)
    await updateDoc(rosterRef, {
      roster: updatedRoster
    })
    console.log(roster);
    setRoster(updatedRoster)
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
       <>
       <Container>
          <Row>
            <Col>NBA Player Tracker</Col>
          </Row>
          <Row>
            <Col md="6">
              <RosterDashboard roster={roster} deleteRoster={deleteRoster}/>
            </Col>
            <Col md="6"><TableComponent setRoster={setRoster} roster={roster} sort={sort} setSort={setSort} activePlayers={activePlayers} playerFilter={playerFilter} handleChange={handleChange}/></Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={onLogOut} variant="primary" type="submit">Sign out</Button>
            </Col>
          </Row>
      </Container>
      </>
  )
}

export default Home;