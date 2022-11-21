import { useCookies } from "react-cookie";
import { BrowserRouter, HashRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Registration";
import Home from "./components/Home";
import { useDispatch, useSelector } from "react-redux";
import { changeUser } from "./store/reducers/user";
import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/topbar";
import ProductList from "./components/productList/ProductList";
import Classroom from "./components/assetManagement/Classroom";
import Lab from "./components/assetManagement/Lab";
import StudentNavbar from "./components/Students/Navbar";
import TeacherLogin from "./components/TeacherAuth/Login";
import TeacherRegister from "./components/TeacherAuth/Register";
import AdminRegister from "./components/Admin/Auth/Registration";
import AdminLogin from "./components/Admin/Auth/Login";
import Spinner from "./components/helper/Spinner";
import Search from "./components/Teachers/Search";
import ShowSearchedProject from "./components/Teachers/ShowSearchedProject";

// lazy import always should be at the bottom of normal imports. If any normal import is below lazy import 
// then it throws error saying move normal import to top.

const ShowProjects = lazy(() => import("./components/Students/ShowProjects"));
const AddTasks = lazy(() => import("./components/Students/AddTasks"));
const CreateProject = lazy(() => import("./components/Students/CreateProject"));
// import ShowDocumentsStudents from "./components/Students/ShowDocuments";
// import ShowPendingProjects from "./components/Students/ShowPendingProjects";
const ShowSingleProject = lazy(() =>
  import("./components/Students/ShowSingleProject")
);
const ShowSingleProjectTeacher = lazy(() =>
  import("./components/Teachers/ShowSingleProject")
);
// import StudentHome from "./components/Students/StudentHome";
const UploadDocument = lazy(() =>
  import("./components/Students/UploadDocument")
);
// import Navbar from "./components/Teachers/Navbar";
const ProjectApprovalRequests = lazy(() =>
  import("./components/Teachers/ProjectApprovalRequests")
);
// import ShowApprovedProjects from "./components/Teachers/ShowApprovedProjects";
// import ShowDocuments from "./components/Teachers/ShowDocuments";
// import TeacherHome from "./components/Teachers/TeacherHome";
const EditProject = lazy(() => import("./components/Students/EditProject"));
const AdminHome = lazy(() => import("./components/Admin/Home"));
const ShowTeachersProjects = lazy(() =>
  import("./components/Admin/ShowTeachersProjects")
);
const AdminShowSingleProject = lazy(() =>
  import("./components/Admin/ShowSingleProject")
);
const MidSemMarks = lazy(() => import("./components/Teachers/MidSemMarks"));
const EditProfile = lazy(() => import("./components/Auth/EditProfile"));
const ChangePassword = lazy(() => import("./components/Auth/ChangePassword"));
const ForgetPassword = lazy(() => import("./components/Auth/ForgetPassword"));
const TeacherChangePassword = lazy(() =>
  import("./components/TeacherAuth/TeacherChangePassword")
);
const TeacherForgetPassword = lazy(() =>
  import("./components/TeacherAuth/TeacherForgetPassword")
);
const TeacherEditProfile = lazy(() =>
  import("./components/TeacherAuth/TeacherEditProfile")
);
const AdminChangePassword = lazy(() =>
  import("./components/Admin/Auth/AdminChangePassword")
);
const AdminForgetPassword = lazy(() =>
  import("./components/Admin/Auth/AdminForgetPassword")
);
const AdminEditProfile = lazy(() =>
  import("./components/Admin/Auth/AdminEditProfile")
);
const HomeDead = lazy(() => import("./components/home/Home"));
const StockRegister = lazy(() =>
  import("./components/deadstockRegister/register.jsx")
);
const StockLogin = lazy(() => import("./components/deadstockAuth/login.jsx"));
const NewProduct = lazy(() => import("./components/newProduct/NewProduct.jsx"));
const Product = lazy(() => import("./components/product/Product"));

function App() {
  const [cookies] = useCookies();
  // // // // // console.log(cookies);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  // // // // // console.log("user is ", user);
  // // // // // console.log(!user, "...");
  // const location = useLocation()
  console.log("user is =  ", typeof cookies.user);
  // console.log("path", location.pathname)

  useEffect(() => {
    if (cookies.user) {
      dispatch(
        changeUser({
          name: cookies.user.name,
          position: cookies.user.position,
          pic: cookies.user.pic,
          email: cookies.user.email,
          _id: cookies.user._id,
        })
      );
    } else {
      dispatch(changeUser(null));
    }
  }, [cookies.user, dispatch]);

  return (
    <BrowserRouter>
      {(user && user.position === "student") ||
      (user && user.position === "teacher") ? (
        <StudentNavbar></StudentNavbar>
      ) : (
        <span></span>
      )}

      {user && user.position === "deadStockManager" ? (
        <Sidebar />
      ) : (
        <span></span>
      )}
      {user && user.position === "deadStockManager" ? (
        <Topbar />
      ) : (
        <span></span>
      )}

      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Home />}></Route>

          {/* Public Routes */}
          {/* Student's Routes */}

          <Route
            path="/register"
            element={
              user && user.position === "student" ? <AddTasks /> : <Register />
            }
          ></Route>
          <Route
            path="/login"
            element={
              user && user.position === "student" ? <AddTasks /> : <Login />
            }
          ></Route>

          <Route path="/dead-stock/">
            <Route
              path="home"
              element={
                user && user.position === "deadStockManager" ? (
                  <HomeDead />
                ) : (
                  <StockLogin />
                )
              }
            />

            <Route
              path="classroom"
              element={
                user && user.position === "deadStockManager" ? (
                  <Classroom />
                ) : (
                  <StockLogin />
                )
              }
            ></Route>
            <Route
              path="lab"
              element={
                user && user.position === "deadStockManager" ? (
                  <Lab />
                ) : (
                  <StockLogin />
                )
              }
            ></Route>
            <Route
              path="productlist"
              element={
                user && user.position === "deadStockManager" ? (
                  <ProductList />
                ) : (
                  <StockLogin />
                )
              }
            ></Route>
            <Route
              path="newproduct"
              element={
                user && user.position === "deadStockManager" ? (
                  <NewProduct />
                ) : (
                  <StockLogin />
                )
              }
            ></Route>
            <Route
              path="edit-product"
              element={
                user && user.position === "deadStockManager" ? (
                  <Product />
                ) : (
                  <StockLogin />
                )
              }
            ></Route>
          </Route>

          {/* Teachers Routes */}
          <Route
            path="/teacher-register"
            element={
              user && user.position === "teacher" ? (
                <ProjectApprovalRequests />
              ) : (
                <TeacherRegister />
              )
            }
          ></Route>
          <Route
            path="/teacher-login"
            element={
              user && user.position === "teacher" ? (
                <ProjectApprovalRequests />
              ) : (
                <TeacherLogin />
              )
            }
          ></Route>
          {/* Admin Routes */}
          <Route
            path="/admin-register"
            element={
              user && user.position === "admin" ? (
                <AdminHome />
              ) : (
                <AdminRegister />
              )
            }
          ></Route>
          <Route
            path="/admin-login"
            element={user && user.position ? <AdminHome /> : <AdminLogin />}
          ></Route>
          {/* Stock routes */}

          <Route
            path="/dead-stock/register"
            element={<StockRegister />}
          ></Route>
          <Route path="/dead-stock/login" element={<StockLogin />}></Route>

          {/* Protected Routes */}
          {/* Students Routes */}
          <Route path="/student/">
            <Route
              path="create-project"
              element={
                user && user.position === "student" ? (
                  <CreateProject />
                ) : (
                  <Login />
                )
              }
            ></Route>
            <Route
              path="edit-profile"
              element={
                user && user.position === "student" ? (
                  <EditProfile />
                ) : (
                  <Login />
                )
              }
            ></Route>
            <Route
              path="change-password"
              element={
                user && user.position === "student" ? (
                  <ChangePassword />
                ) : (
                  <Login />
                )
              }
            ></Route>
            <Route path="forget-password" element={<ForgetPassword />}></Route>

            <Route
              path="edit-project"
              element={
                user && user.position === "student" ? (
                  <EditProject />
                ) : (
                  <Login />
                )
              }
            ></Route>
            {/* <Route
            path="add-task"
            element={
              cookies.student && cookies.student.position === "student" ? (
                <AddTasks />
              ) : (
                <Login />
              )
            }
          ></Route> */}
            <Route
              path="show-documents"
              element={
                user && user.position === "student" ? (
                  <UploadDocument />
                ) : (
                  <Login />
                )
              }
            ></Route>

            <Route
              path="show-single-project"
              element={
                user && user.position === "student" ? (
                  <ShowSingleProject />
                ) : (
                  <Login />
                )
              }
            ></Route>
            {/* Here if u select not approved project then u can edit the title and abstract of the project. */}
            <Route
              path="show-projects"
              element={
                user && user.position === "student" ? (
                  <ShowProjects />
                ) : (
                  <Login />
                )
              }
            ></Route>
            <Route
              path="home"
              element={
                user && user.position === "student" ? <AddTasks /> : <Login />
              }
            ></Route>
          </Route>

          {/* Teachers Routes */}
          <Route path="/teacher/">
            <Route
              path="home"
              element={
                user && user.position === "teacher" ? (
                  <ProjectApprovalRequests />
                ) : (
                  <TeacherLogin />
                )
              }
            ></Route>
            {/* <Route
            path="show-pending-projects"
            element={
              cookies.teacher && cookies.teacher._id ? (
                <ProjectApprovalRequests />
              ) : (
                <TeacherLogin />
              )
            }
          ></Route> */}
            {/* <Route
            path="show-approved-projects"
            element={
              cookies.teacher && cookies.teacher._id ? (
                <ShowApprovedProjects />
              ) : (
                <TeacherLogin />
              )
            }
          ></Route> */}
            {/* <Route
            path="show-documents"
            element={
              cookies.teacher && cookies.teacher._id ? (
                <ShowDocuments />
              ) : (
                <TeacherLogin />
              )
            }
          ></Route> */}
            <Route
              path="show-single-project"
              element={
                user && user.position === "teacher" ? (
                  <ShowSingleProjectTeacher />
                ) : (
                  <TeacherLogin />
                )
              }
            ></Route>
            <Route
              path="add-midsem-marks"
              element={
                user && user.position === "teacher" ? (
                  <MidSemMarks />
                ) : (
                  <TeacherLogin />
                )
              }
            ></Route>

            <Route
              path="search"
              element={
                user && user.position === "teacher" ? (
                  <Search />
                ) : (
                  <TeacherLogin />
                )
              }
            ></Route>

            <Route
              path="searched-project"
              element={
                user && user.position === "teacher" ? (
                  <ShowSearchedProject />
                ) : (
                  <TeacherLogin />
                )
              }
            ></Route>

            <Route
              path="change-password"
              element={
                user && user.position === "teacher" ? (
                  <TeacherChangePassword />
                ) : (
                  <TeacherLogin />
                )
              }
            ></Route>

            <Route
              path="edit-profile"
              element={
                user && user.position === "teacher" ? (
                  <TeacherEditProfile />
                ) : (
                  <TeacherLogin />
                )
              }
            ></Route>

            <Route
              path="forget-password"
              element={<TeacherForgetPassword />}
            ></Route>
          </Route>

          {/* Admin Routes */}
          <Route path="/admin/">
            <Route path="home" element={<AdminHome />}></Route>
            <Route
              path="show-teachers-projects"
              element={
                user && user.position === "admin" ? (
                  <ShowTeachersProjects />
                ) : (
                  <AdminLogin />
                )
              }
            ></Route>
            <Route
              path="show-single-project"
              element={
                user && user.position === "admin" ? (
                  <AdminShowSingleProject />
                ) : (
                  <AdminLogin />
                )
              }
            ></Route>
            <Route
              path="edit-profile"
              element={
                user && user.position === "admin" ? (
                  <AdminEditProfile />
                ) : (
                  <AdminLogin />
                )
              }
            ></Route>
            <Route
              path="change-password"
              element={
                user && user.position === "admin" ? (
                  <AdminChangePassword />
                ) : (
                  <AdminLogin />
                )
              }
            ></Route>
            <Route
              path="forget-password"
              element={<AdminForgetPassword />}
            ></Route>
          </Route>
          <Route path="*" element={<h1>Path not found</h1>}></Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
