import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useCookies } from 'react-cookie';
import ClosingAlert from '../Auth/Alert';
import ShowUploadedDocuments from '../Projects/Students/ShowUploadedDocuments';

export default function ShowDocuments() {
    const [allProjects, setAllProjects] = useState(null);
    const [alertMsg, setAlertMsg] = useState(null);
    const [cookies] = useCookies()
    const headers = {
        authorization : "Bearer " + cookies.token
    }
    console.log("yo..")
    const getAllApprovedProjects = async () => {
        try {
          const response = await axios.get(
            "http://localhost:5000/projects/get-students-approved-projects?studentId=" +
              cookies.student._id,
            { headers }
          );
          if (response.data.status === "failed") {
            setAlertMsg(response.data.msg);
          } else {
            setAllProjects(response.data.projects);
          }
        } catch (error) {
          setAlertMsg("Server Error. Unable to get projects");
        }
      };

      useEffect(() => {
          getAllApprovedProjects()
          
      }, []);
  return (
    <div>
    <div>
        {
            alertMsg ? <ClosingAlert alertColor={'red'} msg={alertMsg} /> : <span></span>
        }
    </div>
        <table>
            <thead>
                <tr>
                    <td>
                        Project Title
                    </td>
                    <td>
                        Abstract
                    </td>
                    <td>
                        Subject
                    </td>
                    <td>
                        Semester
                    </td>
                    <td>
                    <td>
                        Group Members
                    </td>
                        <tr>
                            <td>Name</td>
                            <td>Email</td>
                        </tr>
                    </td>
                    <td>
                        PPT
                    </td>
                    <td>
                        Report
                    </td>
                    <td>
                        Literature Review
                    </td>
                </tr>
            </thead>
            <tbody>
            {
            allProjects && allProjects.length !== 0 ? (allProjects.map((project) => {
                return (
                    <tr key={project._id}><ShowUploadedDocuments project={project} setAlertMsg={setAlertMsg} getAllApprovedProjects={getAllApprovedProjects} headers={headers} /></tr>
                )
            })) : <tr>No projects found</tr> 
        }
            </tbody>
        </table>
    </div>
  )
}
