import ErrorPage from "./pages/ErrorPage";
import {
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/authComponents/Login";
import SignUp from "./components/authComponents/SignUp";
import Application from "./pages/Application";
import LandingPage from "./pages/LandingPage";


export default function Layout() {
  const { user } = useAuth();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route errorElement={<ErrorPage />}>
        <Route
          path="/"
          element={!user ? <LandingPage /> : <Navigate to={"/app"} replace={true} />}
        >
          <Route path={""} element={<Login />} />
          <Route path={"/login"} element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>

        <Route
          path="/app"
          element={
            user ? <Outlet /> : <Navigate to={"/login"} replace={true} />
          }
        >
          <Route path="" element={<Application />} />
        </Route>
      </Route>
    )
  );

  return <RouterProvider router={router} />;
}
