import { configureStore } from "@reduxjs/toolkit";
import adminSelectQuery from "./reducers/adminSelectQuery";
import searchedProject from "./reducers/searchedProject";
import stateChanged from "./reducers/stateChanged";
import studentSelectQuery from "./reducers/studentSelectQuery";
import teacherSelectQuery from "./reducers/teacherSelectQuery";
import user from "./reducers/user";

export default configureStore({
  reducer: {
    studentSelectQuery: studentSelectQuery,
    adminSelectQuery: adminSelectQuery,
    teacherSelectQuery: teacherSelectQuery,
    stateChanged : stateChanged,
    user : user,
    searchedProject: searchedProject
  },
});
