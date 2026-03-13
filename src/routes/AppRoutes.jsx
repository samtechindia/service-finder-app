import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import CustomerLayout from '../layouts/CustomerLayout';
import ProviderLayout from '../layouts/ProviderLayout';
import Home from '../pages/Home';
import Services from '../pages/Services';
import ServiceProviders from '../pages/ServiceProviders';
import Providers from '../pages/Providers';
import ProviderProfile from '../pages/ProviderProfile';
import Booking from '../pages/Booking';
import BookService from '../pages/BookService';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import VerifyOtp from '../pages/VerifyOtp';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TermsOfServices from '../pages/TermsOfServices';
import CoockiesPolicy from '../pages/CoockiesPolicy';
import Contact from '../pages/Contact';
import About from '../pages/About';
import Review from '../pages/Review';
import NotFound from '../pages/NotFound';

// Customer Dashboard Pages
import CustomerDashboard from '../pages/customer/Dashboard';
import CustomerRequests from '../pages/customer/Requests';
import CustomerProfile from '../pages/customer/Profile';

// Provider Dashboard Pages
import ProviderDashboard from '../pages/provider/Dashboard';
import ProviderServices from '../pages/provider/Services';
import ProviderRequests from '../pages/provider/Requests';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<MainLayout><Home /></MainLayout>} />
      <Route path="/services" element={<MainLayout><Services /></MainLayout>} />
      <Route path="/services/:service" element={<MainLayout><ServiceProviders /></MainLayout>} />
      <Route path="/providers" element={<MainLayout><Providers /></MainLayout>} />
      <Route path="/provider/:id" element={<MainLayout><ProviderProfile /></MainLayout>} />
      <Route path="/booking" element={<MainLayout><Booking /></MainLayout>} />
      <Route path="/book-service" element={<MainLayout><BookService /></MainLayout>} />
      <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
      <Route path="/signup" element={<MainLayout><Signup /></MainLayout>} />
      <Route path="/verify-otp" element={<MainLayout><VerifyOtp /></MainLayout>} />
      <Route path="/privacy-policy" element={<MainLayout><PrivacyPolicy /></MainLayout>} />
      <Route path="/terms" element={<MainLayout><TermsOfServices /></MainLayout>} />
      <Route path="/cookies-policy" element={<MainLayout><CoockiesPolicy /></MainLayout>} />
      <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
      <Route path="/about" element={<MainLayout><About /></MainLayout>} />
      <Route path="/review/:bookingId" element={<MainLayout><Review /></MainLayout>} />

      {/* Customer Dashboard Routes */}
      <Route path="/customer/dashboard" element={<CustomerLayout><CustomerDashboard /></CustomerLayout>} />
      <Route path="/customer/requests" element={<CustomerLayout><CustomerRequests /></CustomerLayout>} />
      <Route path="/customer/profile" element={<CustomerLayout><CustomerProfile /></CustomerLayout>} />

      {/* Provider Dashboard Routes */}
      <Route path="/provider/dashboard" element={<ProviderLayout><ProviderDashboard /></ProviderLayout>} />
      <Route path="/provider/services" element={<ProviderLayout><ProviderServices /></ProviderLayout>} />
      <Route path="/provider/requests" element={<ProviderLayout><ProviderRequests /></ProviderLayout>} />
      <Route path="/provider/profile" element={<ProviderLayout><CustomerProfile /></ProviderLayout>} />
      <Route path="/provider/verification" element={<ProviderLayout><CustomerProfile /></ProviderLayout>} />

      {/* 404 Page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
