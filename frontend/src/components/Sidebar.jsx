import { NavLink } from "react-router-dom";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Expenses", path: "/expenses" },
  { name: "Categories", path: "/categories" },
  { name: "Profile", path: "/profile" }
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-30 z-20 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-300 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <span className="text-base font-bold text-gray-800 uppercase tracking-wider">
            Navigation
          </span>
        </div>

        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-semibold border-l-4 border-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent"
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200 text-xs text-gray-500 text-center">
          Expense Management
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
