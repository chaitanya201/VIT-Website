import axios from 'axios';
import React, { useState } from 'react'
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';

export default function EditCell({row, project, setAlertMsg}) {
    const [cellValue, setCellValue] = useState(row.task);
    console.log('custom ', cellValue);
    const user = useSelector((state) => state.user.user)
    const [cookie] = useCookies()
    const headers = {
        authorization : "Bearer " + cookie.token,"Access-Control-Allow-Origin": "*",
    }
    console.log("cell value is ", cellValue);
    console.log("....", cookie)
    const formSubmit = async (e) => {
        e.preventDefault();
        console.log("in form");
        if (cellValue.length < 4) return;
        console.log("passed")
        const task = {task : cellValue, isCompleted: row.isCompleted}
        try {
          const response = await axios.patch(
            `http://localhost:5000/projects/update-task?studentId=${user ? user._id : "123"}` ,
            { task, projectId: project._id,taskId : row._id },
            { headers }
          );
          console.log("response is ",  response.data);
          if (response.data.status !== "success") {
            setAlertMsg(response.data.msg);
          } else setAlertMsg(null)
        } catch (error) {
        //   setAlertMsg("Server Error. try again later");
        }
    }

  return (
    <div>
        {
          row.isCompleted ? <div className='flex bg-pink-200 w-full overflow-y-auto overflow-x-auto'>
            <textarea   cols="30" rows="10" value={cellValue} readOnly  ></textarea>
          </div> : <form onSubmit={formSubmit} className='flex bg-pink-200 w-full overflow-y-auto overflow-x-auto'>
            <textarea  cols="30" rows="10" value={cellValue} onChange={(e) => {setCellValue(e.target.value)}}></textarea>
            <button className='bg-red-700'><input type="submit" value={'Edit'}  /></button>
        </form>
        }
    </div>
  )
}
