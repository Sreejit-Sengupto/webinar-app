import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./Pages/login";
import OtpVerification from "./Pages/OtpVerification";
import Register from "./Pages/Register";
import Homepage from "./Pages/Homepage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path="/" element={<Homepage />}/>
    <Route path="/login" element={<Login />} />
    <Route path="/otp_verification" element={<OtpVerification />} />
    <Route path="/register" element={<Register />} />
    </>
  )
);
  
const App = () => {
  return <RouterProvider router={router} />;
};
export default App;
