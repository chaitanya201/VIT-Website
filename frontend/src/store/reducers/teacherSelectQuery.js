import {createSlice} from '@reduxjs/toolkit';
export const teacherSelectQuerySlice = createSlice({
    name : "selectQuery",
    initialState: {
        teacherSelectQuery : {
            projectYear : {label : 2022, value: 2022},
            div : {label : "A", value: "A"},
            studentYear : {label : "First Year", value: "firstYear"},
            studentBranch : {label : "Electronics And Telecommunications", value: "electronicsAndTelecommunications"},
            sem : {label : "Semester 1", value: 1},
            subject : {label : "Operating System", value : "operatingSystem"},
            isApproved : {label : "Approved By Teacher", value : true},
            isApprovedByAdmin : {label : "Approved By Admin", value : true},
        }
    },
    reducers : {
        changeProjectYear : (state,action) => {
            state.teacherSelectQuery.projectYear.label = action.payload.label
            state.teacherSelectQuery.projectYear.value = action.payload.value
        },
        changeDiv : (state,action) => {
            state.teacherSelectQuery.div.label = action.payload.label
            state.teacherSelectQuery.div.value = action.payload.value
        },
        changeStudentYear : (state,action) => {
            console.log("in store student year pre ", state.teacherSelectQuery.studentYear)
            console.log("action payload is ", action.payload)
            state.teacherSelectQuery.studentYear.label = action.payload.label
            state.teacherSelectQuery.studentYear.value = action.payload.value
            console.log("in store student year after ", state.teacherSelectQuery.studentYear)

        },
        changeStudentBranch : (state,action) => {
            state.teacherSelectQuery.studentBranch.label = action.payload.label
            state.teacherSelectQuery.studentBranch.value = action.payload.value
        },
        changeSem : (state,action) => {
            state.teacherSelectQuery.sem.label = action.payload.label
            state.teacherSelectQuery.sem.value = action.payload.value
        },
        changeSubject : (state,action) => {
            state.teacherSelectQuery.subject.label = action.payload.label
            state.teacherSelectQuery.subject.value = action.payload.value
        },
        changeIsApproved : (state,action) => {
            state.teacherSelectQuery.isApproved.label = action.payload.label
            state.teacherSelectQuery.isApproved.value = action.payload.value
        },
        changeIsApprovedByAdmin : (state,action) => {
            state.teacherSelectQuery.isApprovedByAdmin.label = action.payload.label
            state.teacherSelectQuery.isApprovedByAdmin.value = action.payload.value
        },
    }
})

export const {changeProjectYear, changeDiv,changeSem,changeStudentBranch,changeStudentYear,changeSubject, changeIsApproved,changeIsApprovedByAdmin} = teacherSelectQuerySlice.actions
export default teacherSelectQuerySlice.reducer