import {createSlice} from '@reduxjs/toolkit';
export const stateChangedSlice = createSlice({
    name : "studentSelectQuery",
    initialState: {
        stateChanged : false
    },
    reducers : {
        changed : (state,action) => {
            state.stateChanged = action.payload
        }
        
    }
})

export const {changed} = stateChangedSlice.actions
export default stateChangedSlice.reducer