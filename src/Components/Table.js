import { useEffect } from 'react';
import { useUserAuth } from '../UserAuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';
import Alert from 'react-bootstrap/Alert';

const TableComponent = ({tableRef, activePlayers, sort, setSort, handleChange, playerFilter, roster, setRoster, showTable, setShowTable, showAlert, setShowAlert}) => {

    const {user} = useUserAuth();

    const query = window.matchMedia("(max-width: 768px)")
    const queryTwo = window.matchMedia("(max-width: 1400px)")
    
    useEffect(() => {
        const ths = document.querySelectorAll("th") 
        const handleClick = (element, e) => {
            setSort(element.innerHTML)
            ths.forEach(i => i.style.removeProperty("color"))
            e.target.style.color = "red"
          }
        ths.forEach(i => {
            if (i.id !== "player") {
            i.addEventListener("click",(e) => handleClick(i, e))
            return () => i.removeEventListener("click",(e) => handleClick(i, e))
          }})
        },[])
        
    useEffect(() => {
      const handleChange = () => {
        if (window.innerWidth < 769 && showTable === true) {
          tableRef.current.style.setProperty("right", "0%") 
        } else if (window.innerWidth > 1400 && showTable === true) {
          tableRef.current.style.setProperty("right", "50.5%")
          tableRef.current.style.setProperty("bottom", "0%")
        } else if (window.innerWidth > 769 && window.innerWidth < 1400 && showTable === true) {
          tableRef.current.style.setProperty("right", "51%")
          tableRef.current.style.setProperty("bottom", "0%")
        } else {
          tableRef.current.style.setProperty("right", "100%");
        }}
      query.addEventListener("change", handleChange)
      queryTwo.addEventListener("change", handleChange)
      return () =>  {
        query.removeEventListener("change", handleChange)
        queryTwo.removeEventListener("change", handleChange)
      }
    },[query, queryTwo])

    useEffect(() => {
      const onClick = () => {
        tableRef.current.style.setProperty("right", "100%")
        setShowTable(false)
      }
      const closeButton = document.getElementsByClassName("close-button")[0]
      closeButton.addEventListener("click", onClick)
      return () => closeButton.removeEventListener("click", onClick)
    },[])

    const onClick = async (playerId) => {
      if (roster.map(i => i.id).includes(playerId)) {
        setShowAlert(true);
      } else {
      const updatedRoster = roster.concat(activePlayers.filter(i => i.id === playerId))
      const rosterRef = doc(firestore, "users", user.uid)
      await updateDoc(rosterRef, {
        roster: updatedRoster
      })
      setRoster(updatedRoster)
    }}
       
    const playerSort = activePlayers.filter(i => String(i.first_name + " " + i.last_name).toLowerCase()
      .includes(playerFilter.toLowerCase()))
      .sort((a, b) => { 
       if (sort === "PPG") {
          return b.avg.pts - a.avg.pts
       } else if (sort === "RPG") {
          return b.avg.reb - a.avg.reb
       } else if (sort === "APG") {
          return b.avg.ast - a.avg.ast
       } else if (sort === "BPG") {
          return b.avg.blk - a.avg.blk
       } else if (sort === "SPG") {
          return b.avg.stl - a.avg.stl
       } else if (sort === "FG%") {
          return parseFloat(b.avg.fg_pct * 100).toFixed(1) - parseFloat(a.avg.fg_pct * 100).toFixed(1)
       } else if (sort === "3P%") {
          return parseFloat(b.avg.fg3_pct * 100).toFixed(1) - parseFloat(a.avg.fg3_pct * 100).toFixed(1)
       } else if (sort === "FT%") {
          return parseFloat(b.avg.ft_pct * 100).toFixed(1) - parseFloat(a.avg.ft_pct * 100).toFixed(1)
       } else if (sort === "GP") {
          return b.avg.games_played - a.avg.games_played
       } else {
          return parseInt(b.avg.min.split(':')[0] * 60 + b.avg.min.split(':')[1]) - parseInt(a.avg.min.split(':')[0] * 60 + a.avg.min.split(':')[1]) ;
      }
    })

    return (
        <div ref={tableRef} className="table-container position-absolute border ps-2 pe-2 pt-3">
            {showAlert? <Alert className="table-alert position-absolute" variant="danger" onClose={() => setShowAlert(false)} dismissible>This player is already on the roster</Alert>:<></>}
            <div className='opacity-div opacity-50 position-absolute z-3 w-100 h-100' style={{display:showAlert? "block": "none"}}></div>
            <div className='d-flex align-items-center justify-content-between'>
              <input className="table-search border pb-1 px-1" onChange={handleChange} type="text" placeholder='Search player'/>
              <CloseButton className='close-button mb-2' aria-label='Close'></CloseButton>
            </div> 
            <div className='statistics-table bg-white position-relative overflow-scroll w-100 '>
              <Table size="sm" bordered hover>
                <thead>
                  <tr>
                    <th id="player">Player</th>
                    <th>GP</th>
                    <th>MIN</th>
                    <th style={{color: "red"}} >PPG</th>
                    <th>RPG</th>      
                    <th>APG</th>
                    <th>BPG</th>
                    <th>SPG</th>
                    <th>FG%</th>
                    <th>3P%</th>
                    <th>FT%</th>
                  </tr>
                </thead>
                <tbody id="Statistics-Table-Body" >
                   {playerSort.map(i =><tr key={i.id}>
                    <td><Button className="draft-button me-1" variant="outline-secondary"size="sm" onClick={() => onClick(i.id)}>DRAFT</Button>{i.first_name} {i.last_name} </td>
                    <td>{i.avg.games_played}</td>
                    <td >{i.avg.min}</td>
                    <td >{i.avg.pts.toFixed(1)}</td>
                    <td >{i.avg.reb.toFixed(1)}</td>
                    <td>{i.avg.ast.toFixed(1)}</td>
                    <td>{i.avg.blk.toFixed(1)}</td>
                    <td>{i.avg.stl.toFixed(1)}</td>
                    <td>{parseFloat(i.avg.fg_pct * 100).toFixed(1)}%</td>
                    <td>{parseFloat(i.avg.fg3_pct * 100).toFixed(1)}%</td>
                    <td>{parseFloat(i.avg.ft_pct * 100).toFixed(1)}%</td>
                    </tr>)}
                </tbody>
              </Table>
            </div>
        </div>)
}

export default TableComponent;