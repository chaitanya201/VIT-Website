import {createSlice} from '@reduxjs/toolkit';
export const searchedProjectSlice = createSlice({
    name : "searchedProject",
    initialState: {
        project : []
    },
    reducers : {
        addProject: (state,action) => {
            state.project = action.payload
        }
    }
})

export const {addProject} = searchedProjectSlice.actions
export default searchedProjectSlice.reducer