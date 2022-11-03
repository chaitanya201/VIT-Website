import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { Provider } from "react-redux";
import { BrowserRouter, Router } from "react-router-dom";
import Login from "../../../components/TeacherAuth/Login";
import store from "../../../store/store";

const server = setupServer(
  rest.post("http://localhost:5000/teacher/login", (req, res, ctx) => {
    return res(
      ctx.json({
        status: "success",
        teacher: {
          name: "teacher",
          pic: "fl",
          position: "teacher",
          email: "teacher@gmail.com",
          _id: "fasfas",
        },
      }),

      ctx.cookie("user", {
        name: "teacher",
        pic: "fl",
        position: "teacher",
        email: "teacher@gmail.com",
        _id: "fasfas",
      })
    );
  })
);

// tried everything but unable to mock react-cookie

// jest.mock('react-cookie',)

describe("Teacher login test", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test("should show email and password input", () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByTestId("teacher-email");
    const passwordInput = screen.getByTestId("teacher-password");
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
  });

  test("should show spinner", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    fireEvent.change(screen.getByTestId("teacher-email"), {
      target: { value: "teacher@gmail.com" },
    });
    fireEvent.change(screen.getByTestId("teacher-password"), {
      target: { value: "12345678" },
    });
    fireEvent.submit(screen.getByTestId("teacher-login-btn"));
    expect(screen.getByTestId("spinner")).toBeInTheDocument();
  });

  test("should show alert component for password less than 8 characters", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByTestId("teacher-email");
    const passwordInput = screen.getByTestId("teacher-password");
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "1234567" } });
    fireEvent.click(screen.getByTestId("teacher-login-btn"));
    await waitFor(() => screen.findByTestId("alert"));
  });

  test("should navigate to home page.", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const emailInput = screen.getByTestId("teacher-email");
    const passwordInput = screen.getByTestId("teacher-password");
    fireEvent.change(emailInput, { target: { value: "test@gmail.com" } });
    fireEvent.change(passwordInput, { target: { value: "12345678" } });
    fireEvent.click(screen.getByTestId("teacher-login-btn"));
    await waitFor(() =>
      expect(window.location.pathname).toEqual("/teacher/home")
    );
  });
  test("should navigate to forget password page.", async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <Login />
        </BrowserRouter>
      </Provider>
    );
    const forgetPasswordLink = screen.getByTestId("forget-password");
    fireEvent.click(forgetPasswordLink);
    expect(window.location.pathname).toEqual("/teacher/forget-password");
  });
});
