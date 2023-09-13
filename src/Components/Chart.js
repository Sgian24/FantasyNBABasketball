import React from "react";
import { ResponsiveBar } from "@nivo/bar";
import { useState } from "react";
import Button from "react-bootstrap/Button";

const Chart = ({activePlayers, roster}) => {

  const [rebounds, setRebounds] = useState("pts")
    
  const averagePoints = parseFloat((activePlayers.map(i => i.avg.pts)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)/441)
    .toFixed(1));

  const rosterAveragePoints = roster.map(i => ({
        ppg:i.avg[rebounds],
        Player: i.first_name + " " + i.last_name,
        color: "#56A6A9"
        }))
        
  const leagueAveragePoints = [{
        ppg: averagePoints,
        Player: "League Average",
        color: "#8356A9"
   }]
   
   const totalAveragePoints = leagueAveragePoints.concat(rosterAveragePoints)
   
   const getColor = (bar) => bar.data.color
   
   const theme = {
    "axis": {
        "ticks":{
            "text": {
                "fontSize": 8
            }
        }
    }
  }

  return (
          <div style={{height: 300}}>
            <div style={{paddingTop: 10}}><Button variant="outline-secondary">Rebounds</Button><Button variant="outline-secondary">Assists</Button><Button variant="outline-secondary">Blocks</Button><Button variant="outline-secondary">Steals</Button></div>
            <ResponsiveBar style={{border: "solid 1px black"}}
              data={totalAveragePoints}
              keys={["ppg"]}
              indexBy="Player"
              margin={{ top: 50, right: 20, bottom: 100, left: 60 }}
              padding={0.4}
              valueScale={{ type: "linear" }}
              colors={getColor}
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
                legend: "Points per game",
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
      )
  }
  
export const MemoChart = React.memo(Chart)