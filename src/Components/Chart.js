import { ResponsiveBar } from "@nivo/bar";

const Chart = ({activePlayers, roster}) => {
    
    const averagePoints = parseFloat((activePlayers.map(i => i.avg.pts)
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)/441)
    .toFixed(1));

   const testing = roster.map(i => ({
        ppg:i.avg.pts,
        Player: i.first_name + " " + i.last_name,
        }))
   const testing2 = {
        ppg: averagePoints,
        Player: "League Average"
   }
   
   const con = testing.concat(testing2)
   console.log(activePlayers);
    const Bar = () => {
        return (
            <ResponsiveBar 
                data={con}
                keys={["ppg"]}
                indexBy="Player"
                margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.4}
      valueScale={{ type: "linear" }}
      colors="#3182CE"
      animate={true}
      enableLabel={false}
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
        tickRotation: -50
      }}
            />
        )
    }
    console.log("object", con);
    return (
        <>
        <div style={{height:500}}>
            <Bar/>
        </div>
        </>
    )
}

export default Chart;