import { ResponsiveBar } from "@nivo/bar";

const Chart = ({activePlayers, roster}) => {
    
  const averagePoints = parseFloat((activePlayers.map(i => i.avg.pts)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)/441)
    .toFixed(1));

  const rosterAveragePoints = roster.map(i => ({
        ppg:i.avg.pts,
        Player: i.first_name + " " + i.last_name,
        color: "#56A6A9"
        }))
  const leagueAveragePoints = {
        ppg: averagePoints,
        Player: "League Average",
        color: "#8356A9"
   }
   
   const totalAveragePoints = rosterAveragePoints.concat(leagueAveragePoints)
   
   const getColor = (bar) => bar.data.color
   
   const themeTest = {
    "axis": {
        "ticks":{
            "text": {
                "fontSize": 8
            }
        }
    }
   }

   const Bar = () => {
        return (
          <>
            <ResponsiveBar 
              data={totalAveragePoints}
              keys={["ppg"]}
              indexBy="Player"
              margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
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
                tickRotation: -40,
                tickPadding: 2
              }}
              theme={themeTest}
          />
        </>   
      )
    }
   
    return (
        <>
        <div style={{height:300}}>
            <Bar/>
        </div>
        </>
    )
}

export default Chart;