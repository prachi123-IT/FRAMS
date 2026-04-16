import React from 'react'
import {BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip} from "recharts";

function AttendanceChart({data}){
  return (
    <BarChart width={600} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey="roll_no"/>
        <YAxis/>
        <Tooltip/>
        <Bar dataKey="attendance" fill="#8884d8"/>
    </BarChart>
  )
}

export default AttendanceChart
