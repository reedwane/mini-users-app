import { selectLoggedInUser } from "features/AuthFeature/State/AuthSlice";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const loggedInUser = useSelector(selectLoggedInUser);

  if (!loggedInUser) return <Navigate to={"/"} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
