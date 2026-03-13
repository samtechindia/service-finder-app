import { Link } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-xl font-bold">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          <Link
            to="/admin/dashboard"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/admin/providers"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Manage Providers
          </Link>
          <Link
            to="/admin/bookings"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Manage Bookings
          </Link>
          <Link
            to="/admin/services"
            className="block px-4 py-2 hover:bg-gray-700 transition-colors"
          >
            Manage Services
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600">Admin User</span>
                <button className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
