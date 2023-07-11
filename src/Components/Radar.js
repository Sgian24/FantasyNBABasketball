import React, { useEffect } from "react";
import { useState } from "react";
import {ResponsiveRadar} from "@nivo/radar";
import { propTypes } from "react-bootstrap/esm/Image";

const Radar = ({roster, playerID}) => {
    const [player, setPlayer] = useState() 
    const radarPlayer = roster.filter(i => i.id === playerID)
    const radarNames = radarPlayer.map(i => i.first_name + " " + i.last_name)
    console.log(player)
    useEffect(() => {
        setPlayer(radarPlayer[0])
    },[playerID])
        const test2 = [{
            stats: "Points" ,
            [radarNames]: player.avg.pts,
        }, {
            stats: "Assists", 
            [radarNames]: player.avg.ast
        }, 
            {
             stats: "Rebounds",
             [radarNames]: player.avg.reb
            }, 
            {
             stats: "Blocks",
             [radarNames]: player.avg.blk
            }, 
            {
             stats: "Steals",
             [radarNames]: player.avg.stl
            }]
            const nullData = [{
                stats: "assists",
                null: null,
            }, {
                stats: "points", 
                null: null, 
            }, 
                {
                 stats: "rebounds",
                 null: null,
                }, 
                {
                 stats: "blocks",
                 null: null,
                }, 
                {
                 stats: "steals",
                 null: null  
                }]
                console.log(player);
            const gridLabel = (props) => {
                return (
                    <>
                    <g transform={`translate(${props.x},${props.y})`}>
                        <text alignmentBaseline="middle" textAnchor={props.x < 10 && props.x > 0? "middle": props.x > 10? "start": "end"} fontSize={12}>{props.id}</text>
                    </g>
                    <g transform={`translate(${props.id === "Points"? 8.021436534415163e-15
                                               : props.id === "Assists"? 124.58840363466511 + 5
                                               : props.id === "Rebounds"? 76.99986805031398 + 10
                                               : props.id === "Blocks"? -76.99986805031398 - 7
                                               : -124.58840363466513 - 6
                                               },
                                               ${props.id === "Points"? -131 + 21
                                               : props.id === "Assists"? -40.48122626311811 + 21
                                               : props.id === "Rebounds"? 105.98122626311812 + 21
                                               : props.id === "Blocks"? 105.98122626311812 + 21
                                               : -40.481226263118096 + 21
                                            })`}>   
                        
                        <text alignmentBaseline="middle" textAnchor={props.x < 10 && props.x > 0? "middle": props.x > 10? "start": "end"} fontSize={12} >
                            {props.id === "Points"? player.avg.pts
                            : props.id === "Assists"? player.avg.ast
                            : props.id === "Rebounds"? player.avg.reb
                            : props.id === "Blocks"? player.avg.blk
                            : player.avg.stl                                    
                                                                                    
}</text>
                    </g>
            
                    </>
                )
            }
return (
  <div style={{height: 300}}>
    <ResponsiveRadar
    data={test2}
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
    colors={{ scheme: 'category10' }}
    blendMode="multiply"
    motionConfig="wobbly"
    legends={[
        {
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
        }
    ]}
/>

    </div>
    
    
    )   
}

export default Radar;