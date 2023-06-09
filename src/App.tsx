import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NotFound from "Components/NotFoundPage";
import ProtectedRoute from "Components/ProtectedRoute";
import ViewAllUsers from "features/UserFeature/ViewAllUsers";
import Login from "features/AuthFeature/Login";
import Register from "features/AuthFeature/Register";
import ForgotPassword from "features/AuthFeature/ForgotPassword";
import ViewSingleUser from "features/UserFeature/ViewSingleUser";
import UpdateUser from "features/UserFeature/UpdateUser";
import CreateUser from "features/UserFeature/CreateUser";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />

          <Route path="/app/*" element={<ProtectedRoute />}>
            <Route index element={<ViewAllUsers />} />
            <Route path="create-user" element={<CreateUser />} />
            <Route path=":userId" element={<ViewSingleUser />} />
            <Route path=":userId/edit" element={<UpdateUser />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
