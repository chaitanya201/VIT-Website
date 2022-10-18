import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";
import Register from "../../components/Auth/Registration";
import store from "../../store/store";

beforeEach(() => {
  return Object.defineProperty(window.document, "cookie", {
    writable: true,
    value:
      'user={"_id":"62515128415dc811b84cfec7","name":"Chaitanya Sawant","div":"A","rollNo":"20","email":"chaitanya@gmail.com","mobile":"9503588182","position":"student","password":"$2b$20$WAX1TZffUmV8ISQIxhSqguiYF8eOXVM3WZ52cHWtlxmuSl.jDw81W","pic":"https://firebasestorage.googleapis.com/v0/b/students-project-managem-80227.appspot.com/o/ProfilePictures%2FStudents%2F2dac302b-aaef-459a-97bc-0a143fe06e40dummy%20image%204.png?alt=media&token=887abbfd-6964-4f3c-8f82-b0b8bb35324f","__v":0,"branch":"electronicsAndTelecommunications","year":"thirdYear","grNo":"11910342"},token = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHVkZW50SWQiOiI2MjUxNTEyODQxNWRjODExYjg0Y2ZlYzciLCJpYXQiOjE2NjU4OTE0MDAsImV4cCI6MTY2NTk3NzgwMH0.wG5TX57dguvhvIdFYO7x8rfUZ1pDxpYNaX0fYHxkbDc',
  });
});

// homepage path testing

test("should display homepage", () => {
  window.history.pushState({}, "", "/");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  expect(screen.getByTestId("home-component")).toBeInTheDocument();
});

// register path student

test("should render register component", () => {
  window.history.pushState({}, "", "/register");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("student-register")).toBeInTheDocument();
});

// checking student login component

test("should render student login component", () => {
  window.history.pushState({}, "", "/login");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("student-login")).toBeInTheDocument();
});

// show teacher register component
test("should show teacher register component", () => {
  window.history.pushState({}, "", "/teacher-register");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("teacher-register")).toBeInTheDocument();
});

// show teacher login component
test("should show teacher login component", () => {
  window.history.pushState({}, "", "/teacher-login");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("teacher-login")).toBeInTheDocument();
});

// ADMIN

// show teacher register component
test("should show admin register component", () => {
  window.history.pushState({}, "", "/admin-register");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("admin-register")).toBeInTheDocument();
});

// show admin login component
test("should show admin login component", () => {
  window.history.pushState({}, "", "/admin-login");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("admin-login")).toBeInTheDocument();
});

// Dead Stock Manager

// show dead stock register component
test("should show deadStock register component", () => {
  window.history.pushState({}, "", "/dead-stock/register");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("deadStock-register")).toBeInTheDocument();
});

// show dead stock login component
test("should show deadStock login component", () => {
  window.history.pushState({}, "", "/dead-stock/login");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("deadStock-login")).toBeInTheDocument();
});

// create project route for unauthorized student should show login component.

test("should not show create project component", () => {
  window.history.pushState({}, "", "/student/create-project");
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  expect(screen.getByTestId("student-login")).toBeInTheDocument();
});
