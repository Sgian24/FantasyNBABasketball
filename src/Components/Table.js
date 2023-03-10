import { useEffect } from 'react';
import Table from 'react-bootstrap/Table';

const TableComponent = ({activePlayers, sort, setSort}) => {
   
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

    return (
        <div  >
            <style type="text/css">
                {`  
               thead tr{
                width: 100%;
                display: block;
                cursor: pointer;
               }
           
               tbody {
                display:block;
                height: 400px;
                width: 100%;
                overflow-y: scroll;
               }

              #player {
                cursor: auto;
              }
              
               tr {
               font-size: 14px;
              }

              td:nth-child(1), th:nth-child(1) {
                  min-width: 175px;
              }
              td:nth-child(2), th:nth-child(2) {
                  min-width: 44px;
              }

              td:nth-child(3), th:nth-child(3) {
                  min-width: 50px;
              }

              td:nth-child(n+4):nth-child(-n+8),
              th:nth-child(n+4):nth-child(-n+8) {
                min-width: 38px;
              } 

              td:nth-child(n+9):nth-child(-n+10),
              th:nth-child(n+9):nth-child(-n+10) {
                min-width: 53px;
              } 

              td:nth-child(11) {
                min-width: 57px;
              }
              th:nth-child(11) {
                min-width: 75px;
              }
               `}
            </style>
           
            <Table size="sm" responsive striped bordered hover>
                <thead>
                  <tr>
                    <th id="player">Player</th>
                    <th>GP</th>
                    <th >MIN</th>
                    <th >PPG</th>
                    <th >RPG</th>      
                    <th >APG</th>
                    <th >BPG</th>
                    <th >SPG</th>
                    <th >FG%</th>
                    <th >3P%</th>
                    <th>FT%</th>
                  </tr>
                </thead>
                <tbody>
                   {activePlayers.sort((a, b) => { 
                    if (sort === "PPG") {
                    return b.avg.pts - a.avg.pts
                   } else if (sort === "RPG") {
                    return b.avg.reb - a.avg.reb
                   } else if (sort === "APG") {
                    return b.avg.ast - a.avg.ast
                   } else if (sort === "BPG") {
                    return b.avg.blk - a.avg.blk
                   }  else if (sort === "SPG") {
                    return b.avg.stl - a.avg.stl
                   }  else if (sort === "FG%") {
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
                    }).map(i =><tr key={i.id}>
                    <td><img src="" alt="" />{i.first_name} {i.last_name} </td>
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
    )
}

export default TableComponent;