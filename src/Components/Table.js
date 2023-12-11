import { useEffect } from 'react';
import { useUserAuth } from '../UserAuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import CloseButton from 'react-bootstrap/CloseButton';

const TableComponent = ({activePlayers, sort, setSort, handleChange, playerFilter, roster, setRoster, position, setPosition}) => {

    const {user} = useUserAuth();
    
    useEffect(() => {
        const ths = document.querySelectorAll("th") 
        const handleClick = (element, e) => {
            setSort(element.innerHTML)
            ths.forEach(i => i.style.removeProperty("color"))
            e.target.style.color = "red"
          }
        ths.forEach(i => {if (i.id !== "player") {
            i.addEventListener("click",(e) => handleClick(i, e))
            return () => i.removeEventListener("click",(e) => handleClick(i, e))
          }})
        },[])

    const onClick = async (playerId) => {
      if (roster.map(i => i.id).includes(playerId)) {
        window.alert("included");
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
    console.log(position);
    return (
        <div className="position-absolute border pt-3"style={{ zIndex:3,right:position, top:140, width: "45vw", height:380, transitionDuration:".5s", backgroundColor:"#eff0f2"}}>
            <style type="text/css">
              {`  
              .Statistics-Table {
                overflow: scroll;
                position: relative;
                height: 54vh;
                width: 100%;
                z-index: 1;
                background-color: white;
              }
              
              Table {
               border-collapse: separate;
               border-spacing: 0;
              }
              
               .Statistics-Table th {
                border-bottom: solid 1px #dee2e6;
                position: sticky;
                background: white;
                top: 0;
                cursor: pointer;
                z-index: 2;
               }
              
              #player {
                border-bottom: 1px solid #dee2e6;
                position: sticky;
                background: white;
                left: 0;
                cursor: auto;
                z-index: 3;
              }
              
              tr {
               font-size: 14px;
              }

              td {
               font-size: 12px; 
              }

               tbody tr td:nth-child(1) {
                min-width: 17vw;
                position: sticky;
                left: 0;
                background: white;
                border-bottom: solid 1px #dee2e6;
               }

               .Statistics-Table tbody tr td {
                border-bottom: solid 1px #dee2e6;
               }

               input::placeholder {
                font-size: 12px;
               }
             `}    
            </style>
            <div className='d-flex align-items-center justify-content-between'>
              <input className="border pb-1 px-1" style={{marginBottom:"0.5rem", outlineColor:"#456990"}} onChange={handleChange} type="text" placeholder='Search player'/>
              <CloseButton onClick={() => setPosition(position === 570? 1280: 1000)} className='mb-2' aria-label='Close'></CloseButton>
            </div> 
            <div className='Statistics-Table'>
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
                    <td><Button className="me-1" variant="outline-secondary"size="sm" onClick={() => onClick(i.id)}>DRAFT</Button>{i.first_name} {i.last_name} </td>
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
        </div>
    )
}

export default TableComponent;