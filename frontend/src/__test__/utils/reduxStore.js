import React from "react";
import { render } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import user from "../../store/reducers/user";
import studentSelectQuery from "../../store/reducers/studentSelectQuery";
import teacherSelectQuery from "../../store/reducers/teacherSelectQuery";
import adminSelectQuery from "../../store/reducers/adminSelectQuery";
import stateChanged from "../../store/reducers/stateChanged";
// As a basic setup, import your same slice reducers

export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        user: user,
        studentSelectQuery: studentSelectQuery,
        teacherSelectQuery: teacherSelectQuery,
        adminSelectQuery: adminSelectQuery,
        stateChanged: stateChanged,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
