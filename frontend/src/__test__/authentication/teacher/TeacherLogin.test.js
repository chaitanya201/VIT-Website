import { fireEvent, render, screen } from "@testing-library/react";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";
import { useCookies } from "react-cookie";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import Login from "../../../components/TeacherAuth/Login";
import store from "../../../store/store";
import { renderHook } from '@testing-library/react-hooks'

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
  afterAll(() => server.close());

  test("should login teacher", async () => {
    
    //   const [cookie] = renderHook(() => useCookies())
    // const [cookie, setCookie] = useCookies();
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
    // store.dispatch()
    // console.log("cookies = " , cookie);
  });
});
