import Login, { isEmail } from "../../../components/Auth/Login";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Router } from "react-router";
import { expect } from "@testing-library/jest-dom";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { BrowserRouter } from "react-router-dom";

// setting up dummy server

const server = setupServer(
  rest.post("http://localhost:5000/student/login", (req, res, ctx) => {
    res(ctx.json({student: { name: "Chaitanya", pic:"url", position:"student",email:"chaitanya@gmail.com","_id":"1234" }}));
  })
);

// life-cycle methods

beforeAll(() => server.listen());

afterEach(() => server.resetHandlers());

afterAll(() => server.close());

// test cases.
describe("checking student login component", () => {
  test("should login user", async () => {
    console.log("before------------------")
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    console.log("after******************************");

    await waitFor(() => {
      expect(screen.getByTestId("name")).toBeInTheDocument();
    });
    console.log("name is = ", screen.getByTestId("name").textContent);
    expect(screen.getByTestId("name").textContent).toBe("Chaitanya");
  });
});
