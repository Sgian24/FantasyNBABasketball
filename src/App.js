import {useState, useEffect} from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import TableComponent from './Components/Table'

const App = () => {
  const [activePlayers, setActivePlayers] = useState([]);
  
  const options = {
    method: 'GET',
	  headers: {
		'X-RapidAPI-Key': 'c4adc611f4mshc06c0301b29d24dp14ba88jsn84008b554399',
		'X-RapidAPI-Host': 'nba-player-individual-stats.p.rapidapi.com'
	  }
  };
  
  useEffect(() => {
    const abortController = new AbortController();
    const arrayRange = (start, stop, step) =>
      Array.from(
        { length: (stop - start) / step + 1 },
        (value, index) => start + index * step
    );
    const pages = arrayRange(1,39,1)
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
       const seasonResponse = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=2022&player_ids[]=${playerIDs}`, {signal: abortController.signal})
       activePlayersFiltered.forEach(i => i.avg = seasonResponse.data.data.filter(t => i.id === t.player_id)[0]) 
       setActivePlayers(activePlayersFiltered.filter(i => i.avg !== undefined))
       console.log(seasonResponse.data.data)
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
 
console.log(activePlayers);

 return (
    
    <div className="App">
      <div >
      <TableComponent activePlayers={activePlayers}/>
      </div>
    </div>
  );
}

export default App;
