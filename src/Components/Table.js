import Table from 'react-bootstrap/Table';

const TableComponent = ({activePlayers}) => {
   
    return (
        <div>
            <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>GP</th>
                    <th>MIN</th>
                    <th>PPG</th>
                    <th>RPG</th>      
                    <th>APG</th>
                    <th>BPG</th>
                    <th>SPG</th>
                    <th>FG%</th>
                    <th>3P%</th>
                    <th>FT%</th>
                  </tr>
                </thead>
                <tbody>
                   {activePlayers.map(i =><tr>
                    <td>{i.first_name} {i.last_name} </td>
                    <td>{i.avg.games_played}</td>
                    <td>{i.avg.min}</td>
                    <td>{i.avg.pts.toFixed(1)}</td>
                    <td>{i.avg.reb.toFixed(1)}</td>
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