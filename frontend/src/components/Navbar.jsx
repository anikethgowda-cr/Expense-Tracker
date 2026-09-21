import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";

const Navbar = ({ onToggleSidebar }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white border-b border-gray-300 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
          aria-label="Toggle navigation"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="text-lg font-bold text-gray-800 tracking-tight">
          ExpenseTracker
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-right hidden sm:block">
          <span className="block text-sm font-semibold text-gray-800">
            {user?.username || "User"}
          </span>
          <span className="block text-xs text-gray-500">
            {user?.email || ""}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-red-700 px-3 py-1.5 rounded text-xs font-medium transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
