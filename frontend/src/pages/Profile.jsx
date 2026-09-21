import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMe, logout } from "../redux/slices/authSlice.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRefresh = () => {
    dispatch(getMe());
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="border-b border-gray-300 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
          <p className="text-sm text-gray-600">
            Account credentials and authentication details
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="text-xs bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1.5 rounded font-medium"
        >
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {loading && !user ? (
        <LoadingSpinner message="Loading profile..." />
      ) : (
        <div className="bg-white border border-gray-300 rounded shadow-sm divide-y divide-gray-200">
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Username
              </label>
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-900">
                {user?.username || "Not available"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-sm font-medium text-gray-900">
                {user?.email || "Not available"}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                Account ID
              </label>
              <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-600">
                {user?._id || "Not available"}
              </div>
            </div>

            {user?.createdAt && (
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Member Since
                </label>
                <div className="p-2.5 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
                  {formatDate(user.createdAt)}
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-gray-50 flex items-center justify-between">
            <div>
              <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                Active Session
              </span>
              <span className="text-xs text-gray-500 ml-2">
                JWT Authentication Verified
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
