import {createSlice} from '@reduxjs/toolkit';
export const userSlice = createSlice({
    name : "studentSelectQuery",
    initialState: {
        user : null
    },
    reducers : {
        changeUser : (state,action) => {
            state.user = action.payload
        }
        
    }
})

export const {changeUser} = userSlice.actions
export default userSlice.reducer