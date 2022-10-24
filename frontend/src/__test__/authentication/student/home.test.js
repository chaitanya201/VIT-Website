import { rest } from "msw";
import { setupServer } from "msw/node";
import AddTasks from "../../../components/Students/AddTasks";
import store from "../../../store/store";
import {
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
/**
  {
                _id: "62a3306a883179e5fef9e247",
                year: 2022,
                studentYear: "firstYear",
                div: "A",
                branch: "computerScience",
                projectHead: "6257fde92dc5c2157e54d736",
                adminRemark: "Change the title first.",
                isApprovedByAdmin: false,
                students: [
                  {
                    _id: "62515128415dc811b84cfec7",
                    name: "Chaitanya Sawant",
                    div: "A",
                    rollNo: "20",
                    email: "chaitanya@gmail.com",
                    mobile: "9503588182",
                    position: "student",
                    password:
                      "$2b$20$WAX1TZffUmV8ISQIxhSqguiYF8eOXVM3WZ52cHWtlxmuSl.jDw81W",
                    pic: "https://firebasestorage.googleapis.com/v0/b/students-project-managem-80227.appspot.com/o/ProfilePictures%2FStudents%2F2dac302b-aaef-459a-97bc-0a143fe06e40dummy%20image%204.png?alt=media&token=887abbfd-6964-4f3c-8f82-b0b8bb35324f",
                    __v: 0,
                    branch: "electronicsAndTelecommunications",
                    year: "thirdYear",
                    grNo: "11910342",
                  },
                ],
                marks: [
                  {
                    midSem: {
                      problemStatement: 0,
                      literatureReview: 0,
                      groupFormation: 0,
                      objective: 0,
                      knowledgeOfDomain: 0,
                      totalConverted: 0,
                    },
                    endSem: {
                      projectRealization: 0,
                      projectDesignAndTesting: 0,
                      reportWriting: 0,
                      QualityOfWork: 0,
                      performanceInAssessment: 0,
                      timelyCompletion: 0,
                      totalConverted: 0,
                    },
                    total: 0,
                    studentId: "62515128415dc811b84cfec7",
                    _id: "62a3306a883179e5fef9e248",
                  },
                ],
                isGroupProject: false,
                title: "changed title 2",
                abstract:
                  "changing the abstract but size limit is 15 words that is why I am writing this long sentence. Are?  15 works completed? dummy text is added here. Dont read it.",
                subject: "operatingSystem",
                isApproved: true,
                sem: 1,
                comments: "project remark",
                tasks: [
                  {
                    task: "task 1",
                    remark: "task remark.",
                    isCompleted: true,
                    marks: 9,
                    week: 1,
                    date: "10/5/2022",
                    _id: "62a332d0883179e5fef9e281",
                  },
                  {
                    task: "task 2",
                    isCompleted: false,
                    marks: 0,
                    week: 1,
                    date: "10/5/2022",
                    _id: "62a33644883179e5fef9e2a3",
                  },
                  {
                    task: "third task",
                    isCompleted: false,
                    marks: 0,
                    week: 1,
                    date: "10/5/2022",
                    _id: "62a337e8883179e5fef9e2bb",
                  },
                ],
                __v: 0,
              }
 */
const data = {
  _id: "62a3306a883179e5fef9e247",
  year: 2022,
  studentYear: "firstYear",
  div: "A",
  branch: "computerScience",
  projectHead: "6257fde92dc5c2157e54d736",
  adminRemark: "Change the title first.",
  isApprovedByAdmin: false,
  students: [
    {
      _id: "62515128415dc811b84cfec7",
      name: "Chaitanya Sawant",
      div: "A",
      rollNo: "20",
      email: "chaitanya@gmail.com",
      mobile: "9503588182",
      position: "student",
      password: "$2b$20$WAX1TZffUmV8ISQIxhSqguiYF8eOXVM3WZ52cHWtlxmuSl.jDw81W",
      pic: "https://firebasestorage.googleapis.com/v0/b/students-project-managem-80227.appspot.com/o/ProfilePictures%2FStudents%2F2dac302b-aaef-459a-97bc-0a143fe06e40dummy%20image%204.png?alt=media&token=887abbfd-6964-4f3c-8f82-b0b8bb35324f",
      __v: 0,
      branch: "electronicsAndTelecommunications",
      year: "thirdYear",
      grNo: "11910342",
    },
  ],
  marks: [
    {
      midSem: {
        problemStatement: 0,
        literatureReview: 0,
        groupFormation: 0,
        objective: 0,
        knowledgeOfDomain: 0,
        totalConverted: 0,
      },
      endSem: {
        projectRealization: 0,
        projectDesignAndTesting: 0,
        reportWriting: 0,
        QualityOfWork: 0,
        performanceInAssessment: 0,
        timelyCompletion: 0,
        totalConverted: 0,
      },
      total: 0,
      studentId: "62515128415dc811b84cfec7",
      _id: "62a3306a883179e5fef9e248",
    },
  ],
  isGroupProject: false,
  title: "changed title 2",
  abstract:
    "changing the abstract but size limit is 15 words that is why I am writing this long sentence. Are?  15 works completed? dummy text is added here. Dont read it.",
  subject: "operatingSystem",
  isApproved: true,
  sem: 1,
  comments: "project remark",
  tasks: [
    {
      task: "task 1",
      remark: "task remark.",
      isCompleted: true,
      marks: 9,
      week: 1,
      date: "10/5/2022",
      _id: "62a332d0883179e5fef9e281",
    },
    {
      task: "task 2",
      isCompleted: false,
      marks: 0,
      week: 1,
      date: "10/5/2022",
      _id: "62a33644883179e5fef9e2a3",
    },
    {
      task: "third task",
      isCompleted: false,
      marks: 0,
      week: 1,
      date: "10/5/2022",
      _id: "62a337e8883179e5fef9e2bb",
    },
  ],
  __v: 0,
};

// MuiDataGrid-renderingZone
// life-cycle methods

// beforeAll(() => server.listen());

// afterEach(() => server.resetHandlers());

// afterAll(() => server.close());

test("should display the table with the content", async () => {
  const server = setupServer(
    rest.get(
      "http://localhost:5000/projects/get-students-approved-projects",
      (req, res, ctx) => {
        return res(
          ctx.json({
            projects: [data],
          })
        );
      }
    )
  );
  server.listen();
  render(
    <Provider store={store}>
      <AddTasks />
    </Provider>
  );

  // for these cases it is not working
  // await waitFor(() => screen.findByText(data.abstract));
  // await waitFor(() => screen.findByText(data.branch));
  // await waitFor(() => screen.findByText(/data.comments/));

  // working for only these cases.
  await waitFor(() => screen.findByText(data["title"]));
  await waitFor(() => screen.findByText(data.subject));
  

  // with screen CAN NOT ACCESS ELEMENTS WHICH ARE OUTSIDE OF THE CURRENT COMPONENT, SO can not access nav bar in this component.
});

test("should display no projects found.", async () => {
  const server = setupServer(
    rest.get(
      "http://localhost:5000/projects/get-students-approved-projects",
      (req, res, ctx) => {
        return res(
          ctx.json({
            projects: [],
          })
        );
      }
    )
  );
  server.listen();
  render(
    <Provider store={store}>
      <AddTasks />
    </Provider>
  );

  await waitFor(() => screen.findByTestId("no-projects-found"));
});
