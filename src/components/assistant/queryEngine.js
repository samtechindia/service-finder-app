// Site Knowledge Map
const siteMap = {
  pages: [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Service Providers", path: "/services/:service" },
    { name: "Providers", path: "/providers" },
    { name: "Provider Profile", path: "/provider/:id" },
    { name: "Booking", path: "/booking" },
    { name: "Book Service", path: "/book-service" },
    { name: "Login", path: "/login" },
    { name: "Signup", path: "/signup" },
    { name: "Verify OTP", path: "/verify-otp" },
    { name: "Forgot Password", path: "/forgot-password" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms of Services", path: "/terms" },
    { name: "Cookies Policy", path: "/cookies-policy" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    { name: "Review", path: "/review/:bookingId" },
    { name: "Customer Dashboard", path: "/customer/dashboard" },
    { name: "Customer Requests", path: "/customer/requests" },
    { name: "Customer Profile", path: "/customer/profile" },
    { name: "Provider Dashboard", path: "/provider/dashboard" },
    { name: "Provider Services", path: "/provider/services" },
    { name: "Provider Requests", path: "/provider/requests" }
  ],
  services: [
    "electrician",
    "plumber", 
    "ac repair",
    "hvac",
    "carpenter",
    "painter",
    "cleaning"
  ],
  serviceCategories: [
    "electrician",
    "plumber",
    "hvac", 
    "carpentry",
    "painting",
    "cleaning"
  ]
};

// Mock data
const providersData = [
  {
    id: 1,
    name: "Ramesh Sharma",
    service: "Electrician",
    rating: 4.5,
    location: "Ujjain",
    phone: "+91 98765 43210",
    email: "ramesh.sharma@example.com",
    experience: "8 years",
    description: "Professional electrician with expertise in residential and commercial electrical work.",
    availability: "today"
  },
  {
    id: 2,
    name: "Amit Patel",
    service: "Plumber",
    rating: 4.2,
    location: "Indore",
    phone: "+91 98765 43211",
    email: "amit.patel@example.com",
    experience: "6 years",
    description: "Experienced plumber offering reliable pipe repair and installation services.",
    availability: "emergency"
  },
  {
    id: 3,
    name: "Suresh Kumar",
    service: "AC Repair",
    rating: 4.8,
    location: "Bhopal",
    phone: "+91 98765 43212",
    email: "suresh.kumar@example.com",
    experience: "10 years",
    description: "AC specialist with comprehensive knowledge of all major brands.",
    availability: "week"
  },
  {
    id: 4,
    name: "Vikram Singh",
    service: "Carpenter",
    rating: 4.6,
    location: "Ujjain",
    phone: "+91 98765 43213",
    email: "vikram.singh@example.com",
    experience: "12 years",
    description: "Master carpenter skilled in custom furniture making and woodwork repairs.",
    availability: "weekend"
  },
  {
    id: 5,
    name: "Rahul Verma",
    service: "Painter",
    rating: 4.3,
    location: "Indore",
    phone: "+91 98765 43214",
    email: "rahul.verma@example.com",
    experience: "5 years",
    description: "Professional painter offering interior and exterior painting services.",
    availability: "week"
  },
  {
    id: 6,
    name: "Anita Desai",
    service: "Cleaning",
    rating: 4.7,
    location: "Bhopal",
    phone: "+91 98765 43215",
    email: "anita.desai@example.com",
    experience: "4 years",
    description: "Reliable cleaning service provider for homes and offices.",
    availability: "today"
  }
];

// Safety filter - blocked keywords
const blockedKeywords = [
  'programming', 'code', 'javascript', 'react', 'python', 'java', 'html', 'css',
  'system', 'command', 'terminal', 'bash', 'cmd', 'powershell', 'hack', 'malicious',
  'virus', 'attack', 'exploit', 'admin', 'root', 'sudo', 'password', 'crack',
  'database', 'sql', 'api', 'server', 'backend', 'frontend', 'framework',
  'library', 'package', 'npm', 'yarn', 'git', 'github', 'deploy', 'host'
];

// Query understanding engine
export const processQuery = (query) => {
  const lowerQuery = query.toLowerCase();
  
  // Check for blocked keywords
  for (const keyword of blockedKeywords) {
    if (lowerQuery.includes(keyword)) {
      return {
        type: 'fallback',
        message: 'Gaand ka ilaj hai Gaanduo ka nahi'
      };
    }
  }
  
  // Navigation queries
  if (lowerQuery.includes('contact') || lowerQuery.includes('reach') || lowerQuery.includes('call')) {
    return {
      type: 'navigation',
      message: 'You can reach us through our contact page:',
      action: { type: 'navigate', path: '/contact', label: 'Go to Contact Page' }
    };
  }
  
  if (lowerQuery.includes('about') || lowerQuery.includes('who') || lowerQuery.includes('company')) {
    return {
      type: 'navigation',
      message: 'Learn more about our platform:',
      action: { type: 'navigate', path: '/about', label: 'Go to About Page' }
    };
  }
  
  if (lowerQuery.includes('provider') || lowerQuery.includes('professionals') || lowerQuery.includes('experts')) {
    return {
      type: 'navigation',
      message: 'Browse all our service providers:',
      action: { type: 'navigate', path: '/providers', label: 'View All Providers' }
    };
  }
  
  if (lowerQuery.includes('service') && (lowerQuery.includes('offer') || lowerQuery.includes('available') || lowerQuery.includes('list'))) {
    return {
      type: 'services',
      message: 'We offer the following services:',
      services: siteMap.services.map(service => ({
        name: service.charAt(0).toUpperCase() + service.slice(1),
        path: `/services`
      }))
    };
  }
  
  // Service-specific queries
  for (const service of siteMap.services) {
    if (lowerQuery.includes(service)) {
      const providers = providersData.filter(p => 
        p.service.toLowerCase().includes(service) || 
        lowerQuery.includes(service)
      );
      
      if (providers.length > 0) {
        return {
          type: 'providers',
          message: `Found ${providers.length} ${service} provider(s):`,
          providers: providers.slice(0, 2), // Show max 2 providers
          action: providers.length > 2 ? {
            type: 'navigate',
            path: `/providers?category=${service}`,
            label: `View All ${service.charAt(0).toUpperCase() + service.slice(1)}s`
          } : null
        };
      }
    }
  }
  
  // Location-based queries
  const locations = ['indore', 'bhopal', 'ujjain'];
  for (const location of locations) {
    if (lowerQuery.includes(location)) {
      const providers = providersData.filter(p => 
        p.location.toLowerCase().includes(location)
      );
      
      if (providers.length > 0) {
        return {
          type: 'providers',
          message: `Found ${providers.length} provider(s) in ${location.charAt(0).toUpperCase() + location.slice(1)}:`,
          providers: providers.slice(0, 2),
          action: providers.length > 2 ? {
            type: 'navigate',
            path: `/providers?location=${location}`,
            label: `View All Providers in ${location.charAt(0).toUpperCase() + location.slice(1)}`
          } : null
        };
      }
    }
  }
  
  // General help queries
  if (lowerQuery.includes('help') || lowerQuery.includes('support') || lowerQuery.includes('assist')) {
    return {
      type: 'help',
      message: 'I can help you with:\n• Finding service providers\n• Browsing available services\n• Navigating the website\n• Contact information\n\nWhat would you like to know?'
    };
  }
  
  // Default fallback
  return {
    type: 'fallback',
    message: 'Gaand ka ilaj hai Gaanduo ka nahi'
  };
};

export { siteMap, providersData };
