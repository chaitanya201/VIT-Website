import {createSlice} from '@reduxjs/toolkit';
export const adminSelectQuerySlice = createSlice({
    name : "adminSelectQuery",
    initialState: {
        adminSelectQuery : {
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
            state.adminSelectQuery.projectYear.label = action.payload.label
            state.adminSelectQuery.projectYear.value = action.payload.value
        },
        changeDiv : (state,action) => {
            state.adminSelectQuery.div.label = action.payload.label
            state.adminSelectQuery.div.value = action.payload.value
        },
        changeStudentYear : (state,action) => {
            state.adminSelectQuery.studentYear.label = action.payload.label
            state.adminSelectQuery.studentYear.value = action.payload.value
        },
        changeStudentBranch : (state,action) => {
            state.adminSelectQuery.studentBranch.label = action.payload.label
            state.adminSelectQuery.studentBranch.value = action.payload.value
        },
        changeSem : (state,action) => {
            state.adminSelectQuery.sem.label = action.payload.label
            state.adminSelectQuery.sem.value = action.payload.value
        },
        changeSubject : (state,action) => {
            state.adminSelectQuery.subject.label = action.payload.label
            state.adminSelectQuery.subject.value = action.payload.value
        },
        changeIsApproved : (state,action) => {
            state.adminSelectQuery.isApproved.label = action.payload.label
            state.adminSelectQuery.isApproved.value = action.payload.value
        },
        changeIsApprovedByAdmin : (state,action) => {
            state.adminSelectQuery.isApprovedByAdmin.label = action.payload.label
            state.adminSelectQuery.isApprovedByAdmin.value = action.payload.value
        },
    }
})

export const {changeProjectYear, changeDiv,changeSem,changeStudentBranch,changeStudentYear,changeSubject, changeIsApproved,changeIsApprovedByAdmin} = adminSelectQuerySlice.actions
export default adminSelectQuerySlice.reducer