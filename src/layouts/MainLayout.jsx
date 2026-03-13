import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50" style={{ marginTop: '2px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
