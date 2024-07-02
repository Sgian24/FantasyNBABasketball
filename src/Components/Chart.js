import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

const Chart = ({activePlayers, roster, chartType, setChartType}) => {
    
  const averageStats = parseFloat((activePlayers.map(i => i.avg[chartType])
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)/441)
    .toFixed(1));

  const rosterAverageStats = roster.map(i => ({
        [chartType === "pts"? "PPG"
        : chartType === "reb"? "RPG"
        : chartType === "ast"? "APG"
        : chartType === "blk"? "BPG"
        : "SPG"]: i.avg[chartType],
        Player: i.first_name + " " + i.last_name,
        color: "#028090"
        }))
        
  const leagueAverageStats = [{
        [chartType === "pts"? "PPG"
        : chartType === "reb"? "RPG"
        : chartType === "ast"? "APG"
        : chartType === "blk"? "BPG"
        : "SPG"]: averageStats,
        Player: "League Average",
        color: "#03ADC2"
   }]
   
   const totalAverageStats = leagueAverageStats.concat(rosterAverageStats)
   
   const getColor = (bar) => bar.data.color
   
   const theme = {
    "axis": {
        "ticks":{
            "text": {
                "fontSize": 8,
                "fontFamily": "Arial"
            }
        }
    }
  }

  const statButton = useRef([]);
  const statButtonRef = statButton.current;

  useEffect(() => {
    const onClick = (stat, e) => {
      setChartType(stat === "Points"? "pts"
                  :stat === "Rebounds"? "reb"
                  :stat === "Assists"? "ast"
                  :stat === "Blocks"? "blk"
                  :"stl"); 
      statButtonRef.forEach(i => i.classList.remove("active"))
      e.target.classList.add("active")
    }
    statButtonRef.forEach(i => i?.addEventListener("click", (e) => onClick(i.innerHTML, e)))
    return () => statButtonRef.forEach(i => i?.removeEventListener("click", (e) => onClick(i.innerHTML, e)))
  },[])
 
  return (
    <div>
      <h5>Roster Statistics</h5>
      <div className='main-chart-container bg-white rounded border ' style={{height: "58vh"}}>
          <div className="chart-container">
            <div className="button-group-div d-flex justify-content-center">
             <ButtonGroup className="button-group">
              <Button className="stat-buttons" active ref={element => statButton.current[0] = element} variant="outline-secondary" >Points</Button>
              <Button className="stat-buttons" style={{width:"9vw"}} ref={element => statButton.current[1] = element} variant="outline-secondary" >Rebounds</Button>
              <Button className="stat-buttons" ref={element => statButton.current[2] = element} variant="outline-secondary" >Assists</Button>
              <Button className="stat-buttons" ref={element => statButton.current[3] = element} variant="outline-secondary" >Blocks</Button>
              <Button className="stat-buttons" style={{borderRight:"solid 1px rgba(69, 105, 144, 0.5)"}} ref={element => statButton.current[4] = element} variant="outline-secondary" >Steals</Button>
             </ButtonGroup> 
            </div>
            <ResponsiveBar
              data={totalAverageStats}
              keys={[chartType === "pts"? "PPG"
                    : chartType === "reb"? "RPG"
                    : chartType === "ast"? "APG"
                    : chartType === "blk"? "BPG"
                    : "SPG"]}
              indexBy="Player"
              margin={{ top: 50, right: 20 , bottom: 100, left: 60 }}
              padding={roster.length === 0? 0.8
                      : roster.length === 1? 0.7
                      : roster.length === 2? 0.6
                      : roster.length === 3? 0.5
                      :0.4}
              valueScale={{ type: "linear" }}
              colors={getColor}
              layout={"vertical"}
              animate={true}
              enableLabel={false}
              enableGridX={false}
              enableGridY={false}
              axisTop={null}
              axisRight={null}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: `${chartType === "pts"? "Points"
                        : chartType === "reb"? "Rebounds"
                        : chartType === "ast"? "Assists"
                        : chartType === "blk"? "Blocks"
                        : "Steals" } per game`,
                legendPosition: "middle",
                legendOffset: -40
              }}
              axisBottom={{
                tickRotation: -45,
                tickPadding: 9
              }}
              theme={theme}
          />
        </div>
      </div>
  </div>
      )
  }
  
export const MemoChart = React.memo(Chart)