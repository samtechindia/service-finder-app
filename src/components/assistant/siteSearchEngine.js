// Enhanced Site Search Engine with Content Scanning

// Site Knowledge Map
const siteKnowledge = {
  routes: [
    { path: "/", name: "Home", description: "Main landing page" },
    { path: "/services", name: "Services", description: "Browse all available services" },
    { path: "/services/:service", name: "Service Providers", description: "Providers for specific service" },
    { path: "/providers", name: "Providers", description: "Browse all service providers" },
    { path: "/provider/:id", name: "Provider Profile", description: "Individual provider details" },
    { path: "/booking", name: "Booking", description: "Book a service" },
    { path: "/book-service", name: "Book Service", description: "Service booking form" },
    { path: "/login", name: "Login", description: "User login page" },
    { path: "/signup", name: "Signup", description: "User registration page" },
    { path: "/verify-otp", name: "Verify OTP", description: "OTP verification" },
    { path: "/forgot-password", name: "Forgot Password", description: "Password recovery" },
    { path: "/privacy-policy", name: "Privacy Policy", description: "Privacy policy page" },
    { path: "/terms", name: "Terms of Services", description: "Terms and conditions" },
    { path: "/cookies-policy", name: "Cookies Policy", description: "Cookies policy" },
    { path: "/contact", name: "Contact", description: "Contact information and form" },
    { path: "/about", name: "About", description: "About us page" },
    { path: "/review/:bookingId", name: "Review", description: "Service review page" },
    { path: "/customer/dashboard", name: "Customer Dashboard", description: "Customer dashboard" },
    { path: "/customer/requests", name: "Customer Requests", description: "Customer service requests" },
    { path: "/customer/profile", name: "Customer Profile", description: "Customer profile management" },
    { path: "/provider/dashboard", name: "Provider Dashboard", description: "Provider dashboard" },
    { path: "/provider/services", name: "Provider Services", description: "Provider service management" },
    { path: "/provider/requests", name: "Provider Requests", description: "Provider service requests" }
  ],
  services: [
    { name: "Electrician", category: "electrician", icon: "⚡", description: "Electrical repair services" },
    { name: "Plumber", category: "plumber", icon: "🔧", description: "Pipe and water repair services" },
    { name: "AC Repair", category: "hvac", icon: "❄️", description: "Air conditioner repair services" },
    { name: "Carpenter", category: "carpentry", icon: "🔨", description: "Woodwork and furniture repair services" },
    { name: "Painter", category: "painting", icon: "🎨", description: "Wall painting and decoration services" },
    { name: "Cleaning", category: "cleaning", icon: "🧹", description: "Home and office cleaning services" }
  ],
  providers: [
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
  ],
  locations: ["Indore", "Bhopal", "Ujjain"]
};

// Blocked keywords for safety
const blockedKeywords = [
  'programming', 'code', 'javascript', 'react', 'python', 'java', 'html', 'css',
  'system', 'command', 'terminal', 'bash', 'cmd', 'powershell', 'hack', 'malicious',
  'virus', 'attack', 'exploit', 'admin', 'root', 'sudo', 'password', 'crack',
  'database', 'sql', 'api', 'server', 'backend', 'frontend', 'framework',
  'library', 'package', 'npm', 'yarn', 'git', 'github', 'deploy', 'host'
];

// Main query processing function
export const processSiteQuery = (query) => {
  const lowerQuery = query.toLowerCase().trim();
  
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
  if (lowerQuery.includes('contact') || lowerQuery.includes('reach') || lowerQuery.includes('call') || lowerQuery.includes('phone')) {
    return {
      type: 'navigation',
      message: 'You can reach us through our contact page:',
      action: { type: 'navigate', path: '/contact', label: 'Go to Contact Page' }
    };
  }
  
  if (lowerQuery.includes('about') || lowerQuery.includes('who') || lowerQuery.includes('company') || lowerQuery.includes('story')) {
    return {
      type: 'navigation',
      message: 'Learn more about our platform:',
      action: { type: 'navigate', path: '/about', label: 'Go to About Page' }
    };
  }
  
  if (lowerQuery.includes('provider') || lowerQuery.includes('professional') || lowerQuery.includes('expert') || lowerQuery.includes('vendor')) {
    return {
      type: 'navigation',
      message: 'Browse all our service providers:',
      action: { type: 'navigate', path: '/providers', label: 'View All Providers' }
    };
  }
  
  if (lowerQuery.includes('home') || lowerQuery.includes('main') || lowerQuery.includes('homepage')) {
    return {
      type: 'navigation',
      message: 'Go back to the homepage:',
      action: { type: 'navigate', path: '/', label: 'Go to Home' }
    };
  }
  
  // Service queries
  if (lowerQuery.includes('service') && (lowerQuery.includes('offer') || lowerQuery.includes('available') || lowerQuery.includes('list') || lowerQuery.includes('what'))) {
    const serviceList = siteKnowledge.services.map(service => `• ${service.name}`).join('\n');
    return {
      type: 'services',
      message: `We currently provide these services:\n\n${serviceList}`
    };
  }
  
  // Service-specific provider searches
  for (const service of siteKnowledge.services) {
    if (lowerQuery.includes(service.name.toLowerCase()) || lowerQuery.includes(service.category)) {
      const providers = siteKnowledge.providers.filter(p => 
        p.service.toLowerCase().includes(service.name.toLowerCase()) ||
        p.service.toLowerCase().includes(service.category)
      );
      
      if (providers.length > 0) {
        const providerList = providers.slice(0, 3).map(p => `• ${p.name} (${p.location})`).join('\n');
        return {
          type: 'providers',
          message: `Top ${service.name} providers:\n\n${providerList}`,
          providers: providers.slice(0, 3),
          action: providers.length > 3 ? {
            type: 'navigate',
            path: `/providers?category=${service.category}`,
            label: `View All ${service.name} Providers`
          } : null
        };
      }
    }
  }
  
  // Location-based searches
  for (const location of siteKnowledge.locations) {
    if (lowerQuery.includes(location.toLowerCase())) {
      const providers = siteKnowledge.providers.filter(p => 
        p.location.toLowerCase().includes(location.toLowerCase())
      );
      
      if (providers.length > 0) {
        const providerList = providers.slice(0, 3).map(p => `• ${p.name} - ${p.service}`).join('\n');
        return {
          type: 'providers',
          message: `Service providers in ${location}:\n\n${providerList}`,
          providers: providers.slice(0, 3),
          action: providers.length > 3 ? {
            type: 'navigate',
            path: `/providers?location=${location}`,
            label: `View All Providers in ${location}`
          } : null
        };
      }
    }
  }
  
  // Combined service + location searches
  for (const service of siteKnowledge.services) {
    for (const location of siteKnowledge.locations) {
      if (lowerQuery.includes(service.name.toLowerCase()) && lowerQuery.includes(location.toLowerCase())) {
        const providers = siteKnowledge.providers.filter(p => 
          (p.service.toLowerCase().includes(service.name.toLowerCase()) || p.service.toLowerCase().includes(service.category)) &&
          p.location.toLowerCase().includes(location.toLowerCase())
        );
        
        if (providers.length > 0) {
          const providerList = providers.map(p => `• ${p.name} (⭐ ${p.rating})`).join('\n');
          return {
            type: 'providers',
            message: `${service.name} providers in ${location}:\n\n${providerList}`,
            providers: providers,
            action: {
              type: 'navigate',
              path: `/providers?category=${service.category}&location=${location}`,
              label: `View All ${service.name} Providers in ${location}`
            }
          };
        }
      }
    }
  }
  
  // Booking related queries
  if (lowerQuery.includes('book') || lowerQuery.includes('appointment') || lowerQuery.includes('schedule')) {
    return {
      type: 'navigation',
      message: 'You can book a service through our booking page:',
      action: { type: 'navigate', path: '/booking', label: 'Book a Service' }
    };
  }
  
  // Help queries
  if (lowerQuery.includes('help') || lowerQuery.includes('support') || lowerQuery.includes('assist')) {
    return {
      type: 'help',
      message: 'I can help you with:\n\n• Finding service providers\n• Browsing available services\n• Navigating the website\n• Contact information\n• Booking services\n\nWhat would you like to know?'
    };
  }
  
  // Default fallback
  return {
    type: 'fallback',
    message: 'Gaand ka ilaj hai Gaanduo ka nahi'
  };
};

export { siteKnowledge };
