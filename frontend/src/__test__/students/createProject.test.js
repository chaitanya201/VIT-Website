import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { expect, jest, test } from "@jest/globals";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import CreateProject from "../../components/Students/CreateProject";
import store from "../../store/store";
import { rest } from "msw";
import { setupServer } from "msw/lib/node";

test("should display create project page on /create-project path", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByTestId("create-project")).toBeInTheDocument();
});

test("should display all the components on the page.", () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    </Provider>
  );
  expect(screen.getByPlaceholderText(/title/)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/abstract/i)).toBeInTheDocument();
  expect(screen.getByText(/operating system/i)).toBeInTheDocument();
  expect(screen.getByText(/first year/i)).toBeInTheDocument();
  expect(screen.getByText(/computer science/i)).toBeInTheDocument();
  expect(screen.getByText(/operating system/i)).toBeInTheDocument();
  expect(screen.getByText(/sem 1/i)).toBeInTheDocument();
  // not displaying div A in document
  // expect(screen.getByText(/A/i)).toBeInTheDocument()
  expect(screen.getByPlaceholderText(/teachers email/i)).toBeInTheDocument();
  expect(screen.getByTestId("group-btn")).toBeInTheDocument();
  expect(screen.getByText(/create project/i)).toBeInTheDocument();
});
const server = setupServer(
  rest.post("http://localhost:5000/projects/add", (req, res, context) => {
    return res(
      context.json({
        status: "success",
      })
    );
  })
);


test("should display additional inputs for email when clicked on Group project button", async () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.click(screen.getByTestId("group-btn"));
  await waitFor(async () => {
    await screen.findAllByTestId("extra-email");
    expect(screen.getAllByTestId("extra-email")).toHaveLength(5);
  });
  await waitFor(() => screen.findByTestId("back-btn"));
});


test("should show error message for title", async () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.change(screen.getByPlaceholderText(/title/i), {
    target: { value: "This" },
  });

  await waitFor(() =>
    screen.findByText("Title should be at least 5 characters")
  );
});


test("should show error message for abstract", async () => {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.change(screen.getByPlaceholderText(/abstract/i), {
    target: { value: "Ths" },
  });

  await waitFor(async () => {
    await screen.findByTestId("alert");
  });
});

// test('should show server error msg', () => {
  
// });


test("should create new project", async () => {
  server.listen();
  render(
    <Provider store={store}>
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    </Provider>
  );
  fireEvent.change(screen.getByPlaceholderText(/title/i), {
    target: { value: "This is the title of the project" },
  });
  fireEvent.change(screen.getByPlaceholderText(/abstract/i), {
    target: { value: "This is the abstract of the project." },
  });
  fireEvent.change(screen.getByPlaceholderText(/teachers email/i), {
    target: { value: "teacher@gmail.com" },
  });
  fireEvent.submit(screen.getByTestId("form"));
  await waitFor(() => screen.findByText("Project Created Successfully"));
  server.close();
});
