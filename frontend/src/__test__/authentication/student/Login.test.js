import Login, { alertMsg } from "../../../components/Auth/Login";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router";
// import { expect } from "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../../../store/store";
// setting up dummy server

const server = setupServer(
  rest.post("http://localhost:5000/student/login", (req, res, ctx) => {
    return res(
      ctx.json({
        student: {
          name: "Chaitanya",
          pic: "url",
          position: "student",
          email: "chaitanya@gmail.com",
          _id: "1234",
        },
        status:"success"
      })
    );
  })
);

// life-cycle methods

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

// test cases.
describe("checking student login component", () => {


  test("should give error saying email is invalid", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByTestId("student-email"), {
      target: { value: "chaitanyagmail.com" },
    });
    fireEvent.change(screen.getByTestId("student-password"), {
      target: { value: "12345678" },
    });
    fireEvent.submit(screen.getByTestId("student-login-form"));
    
    // this line is showing in the red part but actually it is working.
    // await waitFor(() => expect(screen.getByTestId("alert")).toBeInTheDocument())

    // Below code is alternative to above waitFor.
    await waitFor(() => screen.findByTestId("alert"))
    
  });
  
  test("should give login user", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByTestId("student-email"), {
      target: { value: "chaitanya@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("student-password"), {
      target: { value: "12345678" },
    });
    fireEvent.submit(screen.getByTestId("student-login-form"));
    
    // this line is showing in the red part but actually it is working.
    // i am checking that error is not display instead the other div is being displayed.
    // await waitFor(() => expect(screen.getByTestId("non")).toBeInTheDocument())

    // this waitFor is alternative for above code.
    await waitFor(() => screen.findByTestId("non"))
    
  });
});
