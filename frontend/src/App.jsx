import { useEffect } from "react";
import { useDispatch } from "react-redux";
import AppRoutes from "./routes/AppRoutes.jsx";
import { getMe } from "./redux/slices/authSlice.js";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getMe());
    }
  }, [dispatch]);

  return <AppRoutes />;
}

export default App;
