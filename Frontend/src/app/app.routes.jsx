import { createBrowserRouter } from "react-router";
import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import Dashbord from "../features/chat/pages/Dashbord";
import Protected from "../components/Protected";
import { Navigate } from "react-router";

export const router = createBrowserRouter([
    {
        path: "/",
        element:
        <Protected>
          <Dashbord />
        </Protected>
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/login",
        element: <Login />  
    },
    {
        path: "/dashbord",
        element: <Navigate to="/" />
    }
])
