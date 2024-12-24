import React, { useEffect } from "react";
import {ResponsiveRadar} from "@nivo/radar";

const Radar = ({roster, playerID, setPlayerID, player, setPlayer}) => {

   useEffect(() => {
        setPlayer(radarPlayer[0])
    },[playerID])

    useEffect(() => {
        setPlayerID(12345)
    },[])
    
    const defaultStats = {
        playerID: 12345,
        first_name: "N/A",
        last_name: "",
        stats: {
            ast: 0.00,
            pts: 0.00,
            blk: 0.00,
            stl: 0.00,
            reb: 0.00
        }
      }
    

    const radarPlayer = roster.concat(defaultStats).filter(i => i.playerID === playerID)

    const radarNames = playerID === ""? "N/A": radarPlayer.map(i => i.espnName)
    console.log(playerID);
    console.log(roster);

    const radarData = [
        {
          stats: "Points" ,
          [radarNames]: playerID === ""? 0: player?.stats.pts
        }, 
        {
          stats: "Assists", 
          [radarNames]: playerID === ""? 0: player?.stats.ast
        }, 
        {
          stats: "Rebounds",
          [radarNames]: playerID === ""? 0: player?.stats.reb
        }, 
        {
          stats: "Blocks",
          [radarNames]: playerID === ""? 0: player?.stats.blk
        }, 
        {
          stats: "Steals",       
          [radarNames]: playerID === ""? 0: player?.stats.stl
        }]

    const gridLabel = (props) => {
        return (
            <>
             <g transform={`translate(${props.x},${props.y})`}>
                <text alignmentBaseline="middle" textAnchor={props.x < 10 && props.x > 0? "middle": props.x > 10? "start": "end"} fontSize={12}>{props.id}</text>
                <text transform={`translate(${props.id === "Points"? 0
                                        : props.id === "Assists"? 0
                                        : props.id === "Rebounds"? 0
                                        : props.id === "Blocks"? 0
                                        : 0
                                        },
                                        ${props.id === "Points"? 21
                                        : props.id === "Assists"? 21
                                        : props.id === "Rebounds"? 21
                                        : props.id === "Blocks"? 21
                                        : 21
                                        })`} alignmentBaseline="middle" textAnchor={props.x < 10 && props.x > 0? "middle": props.x > 10? "start": "end"} fontSize={18} fill={"#028090"} >
                    {
                    props.id === "Points" & playerID !== ""? player?.stats.pts
                    : props.id === "Assists"  & playerID !== ""? player?.stats.ast
                    : props.id === "Rebounds" & playerID !== ""? player?.stats.reb
                    : props.id === "Blocks" & playerID !== ""? player?.stats.blk
                    : props.id === "Steals" & playerID !== ""? player?.stats.stl 
                    : ""                                 
                    }</text>
             </g>
            </>
        )}

      const colour = {
        blue: "#028090"
      }
    return (
     <>
       <h5 className="mb-2">Radar</h5>
       <div className='bg-white rounded border' style={{height:"58vh"}}> 
        <div className="radar-div mb-3">
         <ResponsiveRadar
            data={radarData}
            keys={[radarNames]}
            indexBy="stats"
            maxValue={40}
            valueFormat=">-.2f"
            margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
            gridShape="linear"
            gridLabel={gridLabel}
            gridLabelOffset={36}
            dotSize={0}
            dotColor={{ theme: 'background' }}
            dotBorderWidth={2}
            colors={colour.blue}
            blendMode="multiply"
            motionConfig="wobbly"
            isInteractive={false}
            legends={[{
                anchor: 'top-left',
                direction: 'column',
                translateX: -50,
                translateY: -40,
                itemWidth: 80,
                itemHeight: 20,
                itemTextColor: '#999',
                symbolSize: 12,
                symbolShape: 'circle',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemTextColor: '#000'
                        }
                    }
                ]
            }]}
         />
        </div>
       </div>
     </>
    )   
}

export default Radar;