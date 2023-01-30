import {useState, useEffect} from 'react';
import axios from 'axios';

const App = () => {
  const [activePlayers, setActivePlayers] = useState("");
  const [players, setPlayers] = useState(false);

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
    const getData = async () => {
     try { 
       const response = await Promise.all(
         pages.map( async i => {
           const res = await axios.get(`https://www.balldontlie.io/api/v1/players?page=${i}&per_page=100`, {signal: abortController.signal})
          return res;  
          })
      )
       const response2 = await axios.get('https://nba-player-individual-stats.p.rapidapi.com/players', options)
       setPlayers(response2)
       const filtered = response.filter(i => i.data.data.some(t => t.first_name === 'LeBron' && t.last_name === "James"));
       console.log(filtered[0].data.data.filter(i => i.first_name === "LeBron" && i.last_name === "James"));
     } catch (error) {
       if (error.response) {
         console.log(error.response.data);
         console.log(error.response.status);
         console.log(error.response.headers); 
       } else if (error.request) {
         console.log(error.request);
       } else if (error.name === "AbortError") {
         console.log("aborted");
       } else {
        console.log(error.message);
       }
     }
     
   }
   getData();
   
  // setActivePlayers(totalPlayers);
   return () => abortController.abort();
  },[])
 
 
  return (
    <div className="App">
     
    </div>
  );
}

export default App;
