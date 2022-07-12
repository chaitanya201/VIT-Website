import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie'
import ClosingAlert from '../Auth/Alert';
import ShowProjects from '../Projects/Students/ShowProjects';

export default function ShowPendingProjects() {
    const [cookies] = useCookies()
    const [allProjects, setAllProjects] = useState(null);
    const [alertMsg, setAlertMsg] = useState(null);
    const headers = {
        authorization : "Bearer " + cookies.token
    }
    useEffect(() => {
        const getAllPendingProjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/projects/students/get-all-pending-projects?studentId='+cookies.student._id,{headers})
                if(response.data.status === "success") {
                    setAllProjects(response.data.projects)
                } else {
                    setAlertMsg(response.data.msg)
                }
            } catch (error) {
                setAlertMsg("Server Error. Try again later")
            }
        }
        getAllPendingProjects()
    }, []);
  return (
    <div>
        <div>
            {
                alertMsg ? <ClosingAlert msg={alertMsg} /> : <span></span>
            }
        </div>
        <div>
            {
                allProjects && allProjects.length !== 0 ? allProjects.map((project) => {
                    return (
                        <ShowProjects project={project} key={project._id} />
                    )
                }) : <span></span>
            }
        </div>

    </div>
  )
}
