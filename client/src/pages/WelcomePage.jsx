import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import hospitalLogo from "../assets/images/hospital-logo.png";
import heroImage from "../assets/images/hospital1.webp";
import sarahAvatar from "../assets/images/sarah.jpg";
import chenAvatar from "../assets/images/chen.jpg";
import emilyAvatar from "../assets/images/emily.jpg";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFeatureCategory, setActiveFeatureCategory] = useState("clinical");
  const [expandedFeature, setExpandedFeature] = useState(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const featureModalRef = useRef(null);

  // Initialize animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
    AOS.refresh();

    // Add scroll event listener for navbar
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close modal when clicking outside or pressing escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (featureModalRef.current && !featureModalRef.current.contains(event.target)) {
        closeFeatureModal();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeFeatureModal();
      }
    };

    if (isFeatureModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isFeatureModalOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isFeatureModalOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  }, [isFeatureModalOpen]);

  // Testimonial auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev === 2 ? 0 : prev + 1));
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Scroll to section function
  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Open feature modal
  const openFeatureModal = (feature) => {
    setExpandedFeature(feature);
    setIsFeatureModalOpen(true);
  };

  // Close feature modal
  const closeFeatureModal = () => {
    setIsFeatureModalOpen(false);
  };

  // Get color class based on category
  const getCategoryColorClass = (type, shade, category = activeFeatureCategory) => {
    const colorMap = {
      blue: {
        50: 'bg-blue-50', 100: 'bg-blue-100', 600: 'bg-blue-600', 700: 'bg-blue-700',
        text50: 'text-blue-50', text100: 'text-blue-100', text600: 'text-blue-600', text700: 'text-blue-700',
        hover100: 'hover:bg-blue-100', hover600: 'hover:bg-blue-600', hover700: 'hover:bg-blue-700'
      },
      purple: {
        50: 'bg-purple-50', 100: 'bg-purple-100', 600: 'bg-purple-600', 700: 'bg-purple-700',
        text50: 'text-purple-50', text100: 'text-purple-100', text600: 'text-purple-600', text700: 'text-purple-700',
        hover100: 'hover:bg-purple-100', hover600: 'hover:bg-purple-600', hover700: 'hover:bg-purple-700'
      },
      green: {
        50: 'bg-green-50', 100: 'bg-green-100', 600: 'bg-green-600', 700: 'bg-green-700',
        text50: 'text-green-50', text100: 'text-green-100', text600: 'text-green-600', text700: 'text-green-700',
        hover100: 'hover:bg-green-100', hover600: 'hover:bg-green-600', hover700: 'hover:bg-green-700'
      }
    };

    const color = featureCategories[category].color;
    if (type === 'bg') return colorMap[color][shade];
    if (type === 'text') return colorMap[color][`text${shade}`];
    if (type === 'hover') return colorMap[color][`hover${shade}`];
    return '';
  };

  // Get badge color class
  const getBadgeColorClass = (badge, type) => {
    if (badge === 'New') {
      return type === 'bg' ? 'bg-yellow-100' : 'text-yellow-600';
    } else {
      return type === 'bg' ? 'bg-green-100' : 'text-green-600';
    }
  };

  const featureCategories = {
    clinical: {
      title: "Clinical Management",
      icon: "fa-stethoscope",
      color: "blue",
      description: "Powerful tools for healthcare providers to deliver exceptional patient care",
      features: [
        {
          id: "doctor-mgmt",
          icon: "fa-user-md",
          title: "Doctor Management",
          description: "Efficiently manage doctor schedules, specializations, and patient assignments.",
          fullDescription: "Our comprehensive doctor management system streamlines physician scheduling, credentialing, and departmental assignments. Track performance metrics, manage on-call rotations, and ensure optimal coverage across all departments.",
          benefits: [
            "Reduce scheduling conflicts by 85%",
            "Optimize doctor availability across departments",
            "Track performance metrics and patient satisfaction",
            "Automated credential verification and renewal alerts"
          ],
          image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
        {
          id: "patient-records",
          icon: "fa-users",
          title: "Patient Records",
          description: "Securely store and access patient medical history, treatments, and prescriptions.",
          fullDescription: "Maintain comprehensive, HIPAA-compliant electronic health records that provide a complete view of patient health history. Our system allows for secure access across departments while maintaining strict privacy controls.",
          benefits: [
            "HIPAA-compliant secure data storage",
            "Instant access to medical histories from any department",
            "Advanced search capabilities across all patient data",
            "Integrated allergy and drug interaction alerts"
          ],
          image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
        {
          id: "appointment-system",
          icon: "fa-calendar-check",
          title: "Appointment System",
          description: "Streamline booking process with our intuitive appointment scheduling system.",
          fullDescription: "Our smart appointment system optimizes clinic schedules, reduces wait times, and minimizes no-shows through automated reminders. The system intelligently balances physician workloads while prioritizing urgent care needs.",
          benefits: [
            "Reduce no-shows by 35% with automated reminders",
            "Intelligent scheduling based on provider availability",
            "Multi-channel booking options (web, mobile, phone)",
            "Waiting list management for high-demand specialists"
          ],
          image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
      ]
    },
    administrative: {
      title: "Administrative Tools",
      icon: "fa-clipboard-list",
      color: "purple",
      description: "Streamline operations and manage your facility with maximum efficiency",
      features: [
        {
          id: "medical-reports",
          icon: "fa-file-medical",
          title: "Medical Reports",
          description: "Generate and store comprehensive medical reports with just a few clicks.",
          fullDescription: "Create standardized or custom medical reports for patients, departments, or regulatory compliance with our powerful reporting engine. The system automatically pulls relevant data, reducing documentation time by up to 60%.",
          benefits: [
            "Customizable report templates for different specialties",
            "Automated data population from patient records",
            "Export in multiple formats (PDF, DOC, CSV)",
            "Digital signature support for report authorization"
          ],
          image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
        {
          id: "inventory-mgmt",
          icon: "fa-boxes",
          title: "Inventory Management",
          badge: "New",
          description: "Track medical supplies, set reorder points, and manage vendor relationships.",
          fullDescription: "Our inventory management system provides real-time tracking of medical supplies, equipment, and pharmaceuticals. Get alerts when supplies are running low, track usage patterns, and optimize procurement to reduce costs.",
          benefits: [
            "Reduce wastage by 30% through better inventory planning",
            "Automated reordering based on customizable thresholds",
            "Barcode/RFID integration for accurate tracking",
            "Vendor performance analytics and contract management"
          ],
          image: "https://images.unsplash.com/photo-1587351021759-3e566b3db4f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
        {
          id: "staff-scheduling",
          icon: "fa-user-clock",
          title: "Staff Scheduling",
          description: "Create optimal staff schedules that balance workload and availability.",
          fullDescription: "Efficiently manage the complex scheduling needs of your healthcare facility. Our system considers staff qualifications, department needs, shift preferences, and compliance requirements to create optimal schedules.",
          benefits: [
            "Reduce overtime costs through optimized scheduling",
            "Real-time alerts for coverage gaps or compliance issues",
            "Self-service portal for staff to request time off or swap shifts",
            "Labor cost forecasting and budget management"
          ],
          image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
      ]
    },
    financial: {
      title: "Financial Management",
      icon: "fa-money-bill-wave",
      color: "green",
      description: "Optimize revenue cycles and maintain financial health with our integrated solutions",
      features: [
        {
          id: "billing-payments",
          icon: "fa-money-bill-wave",
          title: "Billing & Payments",
          badge: "Popular",
          description: "Simplify financial operations with our integrated billing and payment system.",
          fullDescription: "Our comprehensive billing system handles the entire revenue cycle, from insurance verification to claim submission and payment posting. Reduce denials, accelerate collections, and improve your bottom line.",
          benefits: [
            "99.4% billing accuracy with automated code verification",
            "Multiple payment gateways for patient convenience",
            "Automated insurance eligibility verification",
            "Payment plan management for patient financial assistance"
          ],
          image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
        {
          id: "revenue-mgmt",
          icon: "fa-chart-line",
          title: "Revenue Management",
          description: "Track revenue streams, manage claims, and reduce revenue leakage.",
          fullDescription: "Maximize your facility's financial performance with our revenue cycle management tools. Identify bottlenecks, reduce claim rejections, and accelerate payments through analytics-driven insights and automation.",
          benefits: [
            "Improve cash flow by 25% through accelerated claims processing",
            "Reduce claim rejections with pre-submission validation",
            "Identify and recover potentially missed charges",
            "Financial forecasting based on historical data and trends"
          ],
          image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
        {
          id: "analytics",
          icon: "fa-chart-bar",
          title: "Analytics Dashboard",
          description: "Gain valuable insights with customizable analytics and reporting tools.",
          fullDescription: "Turn your healthcare data into actionable insights with our powerful analytics platform. Monitor KPIs, identify trends, and make data-driven decisions across clinical, operational, and financial domains.",
          benefits: [
            "Customizable KPI tracking for different management levels",
            "Interactive visual reports with drill-down capabilities",
            "Predictive analytics for resource planning and demand forecasting",
            "Benchmarking against industry standards and best practices"
          ],
          image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80"
        },
      ]
    }
  };

  const testimonials = [
    {
      quote:
        "MedCare HMS has transformed our hospital operations. Patient management is now seamless and efficient.",
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      avatar: sarahAvatar,
    },
    {
      quote:
        "The intuitive interface made training our staff quick and easy. We've saved countless hours on administrative tasks.",
      name: "Michael Chen",
      role: "Hospital Administrator",
      avatar: chenAvatar,
    },
    {
      quote:
        "As a doctor, having instant access to patient records has improved my decision-making and quality of care.",
      name: "Dr. Emily Rodriguez",
      role: "Cardiologist",
      avatar: emilyAvatar,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-x-hidden">
      {/* Feature Detail Modal with Animation Fix */}
      {isFeatureModalOpen && expandedFeature && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4" 
             aria-modal="true" role="dialog" aria-labelledby="feature-modal-title">
          <div 
            ref={featureModalRef}
            className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto transform transition-all animate-scaleIn"
          >
            <div className="relative">
              <div className="h-60 sm:h-80 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-xl overflow-hidden">
                <img 
                  src={expandedFeature.image} 
                  alt={expandedFeature.title}
                  className="w-full h-full object-cover mix-blend-overlay"
                />
                <button 
                  onClick={closeFeatureModal}
                  className="absolute top-4 right-4 bg-white bg-opacity-30 hover:bg-opacity-50 rounded-full p-2 text-white transition-all"
                  aria-label="Close modal"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
              
              <div className="absolute bottom-0 translate-y-1/2 left-8">
                <div className="bg-white rounded-full p-5 shadow-xl">
                  <i className={`fas ${expandedFeature.icon} text-3xl text-blue-600`}></i>
                </div>
              </div>
            </div>
            
            <div className="p-8 pt-12">
              <div className="flex flex-col sm:flex-row justify-between sm:items-start mb-6 gap-4">
                <div>
                  <h3 id="feature-modal-title" className="text-2xl font-bold text-gray-800">{expandedFeature.title}</h3>
                  {expandedFeature.badge && (
                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mt-2 ${getBadgeColorClass(expandedFeature.badge, 'bg')} ${getBadgeColorClass(expandedFeature.badge, 'text')}`}>
                      {expandedFeature.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <i className="fas fa-users mr-2"></i>
                  <span>5,000+ hospitals use this feature</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-8 text-lg">{expandedFeature.fullDescription}</p>
              
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">Key Benefits</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {expandedFeature.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-start bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div className="text-green-500 mr-3 mt-1">
                        <i className="fas fa-check-circle text-lg"></i>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="rounded-xl border border-gray-200 p-6 mb-8">
                <div className="flex items-center mb-4">
                  <i className="fas fa-quote-left text-2xl text-blue-300 mr-4"></i>
                  <h4 className="text-lg font-medium text-gray-800">What users are saying</h4>
                </div>
                <p className="italic text-gray-600">
                  "The {expandedFeature.title} feature has completely transformed how we operate. 
                  We've seen dramatic improvements in efficiency and staff satisfaction."
                </p>
                <p className="text-sm text-gray-500 font-medium mt-3 text-right">
                  — Healthcare Administrator
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    closeFeatureModal();
                    navigate("/signup");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:shadow-lg flex-1 flex items-center justify-center"
                >
                  <span>Start Using This Feature</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
                <button
                  onClick={closeFeatureModal}
                  className="border border-gray-300 text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-all flex-1"
                >
                  Explore Other Features
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation - Now with scroll-based styling */}
      <header 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                src={hospitalLogo}
                alt="MedCare Logo"
                className={`h-10 w-10 object-contain mr-3 ${isScrolled ? "" : "animate-pulse"}`}
              />
              <span className={`text-2xl font-bold ${isScrolled ? "text-blue-600" : "text-blue-600"}`}>
                MedCare HMS
              </span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => scrollToSection("features")}
                className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-105 transform focus:outline-none"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("services")}
                className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-105 transform focus:outline-none"
              >
                Services
              </button>
              <button
                onClick={() => scrollToSection("testimonials")}
                className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-105 transform focus:outline-none"
              >
                Testimonials
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-105 transform focus:outline-none"
              >
                Contact
              </button>
            </nav>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-500 hover:text-blue-600 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
            </button>
            
            {/* Auth buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-800 font-medium transition-transform hover:scale-105 bg-transparent border-0 focus:outline-none"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className={`${
                  isScrolled 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 hover:shadow-lg focus:outline-none`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Mobile Navigation Menu */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 ${
          mobileMenuOpen 
            ? "opacity-100 pointer-events-auto" 
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileMenuOpen}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="absolute top-0 right-0 w-64 h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out p-5 pt-20 overflow-y-auto">
          <button 
            className="absolute top-5 right-5 text-gray-500 hover:text-blue-600"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-600 hover:text-blue-600 py-2 transition-colors text-left border-b border-gray-100"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-600 hover:text-blue-600 py-2 transition-colors text-left border-b border-gray-100"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-600 hover:text-blue-600 py-2 transition-colors text-left border-b border-gray-100"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-600 hover:text-blue-600 py-2 transition-colors text-left border-b border-gray-100"
            >
              Contact
            </button>
            
            <div className="pt-4 flex flex-col space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/login");
                }}
                className="text-blue-600 border border-blue-600 rounded-lg py-2 hover:bg-blue-50 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/signup");
                }}
                className="bg-blue-600 text-white rounded-lg py-2 hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section - remains mostly the same */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-float"></div>
        <div className="absolute bottom-20 right-40 w-12 h-12 bg-blue-300 rounded-full opacity-30 animate-float-delay"></div>
        <div className="absolute top-40 right-10 w-16 h-16 bg-blue-400 rounded-full opacity-10 animate-float-slow"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0" data-aos="fade-right">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Modern Healthcare Management{" "}
              <span className="text-blue-600 relative inline-block">
                Simplified
                <span className="absolute bottom-1 left-0 w-full h-1 bg-blue-300 opacity-70 rounded"></span>
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Streamline your hospital operations, enhance patient care, and
              improve efficiency with our comprehensive hospital management
              system.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center"
              >
                <span>Get Started</span>
                <i className="fas fa-arrow-right ml-2 text-sm"></i>
              </button>
              <button
                onClick={() => navigate("/login")}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-center px-6 py-3 rounded-lg font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1"
              >
                Login
              </button>
            </div>
            
            {/* Feature badges */}
            <div className="mt-10 flex flex-wrap gap-2">
              <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-600 rounded-full">HIPAA Compliant</span>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-green-100 text-green-600 rounded-full">24/7 Support</span>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-purple-100 text-purple-600 rounded-full">Cloud-Based</span>
              <span className="inline-block px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-600 rounded-full">Easy Integration</span>
            </div>
          </div>
          <div className="md:w-1/2 relative" data-aos="fade-left" data-aos-delay="200">
            {/* Image with decorative elements */}
            <div className="absolute -top-4 -left-4 w-full h-full bg-blue-200 rounded-xl transform rotate-3 opacity-50"></div>
            <div className="relative">
              <img
                src={heroImage}
                alt="Healthcare Team Consultation"
                className="rounded-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02] w-full h-auto object-cover object-center md:h-[400px]"
                loading="lazy"
              />
              <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-lg shadow-lg transform rotate-3 animate-float">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm font-semibold">Live Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "99.9%", label: "Uptime", icon: "fas fa-server" },
              { value: "10k+", label: "Active Users", icon: "fas fa-users" },
              { value: "50+", label: "Hospitals", icon: "fas fa-hospital" },
              { value: "24/7", label: "Customer Support", icon: "fas fa-headset" },
            ].map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all text-center"
                data-aos="zoom-in"
                data-aos-delay={index * 100}
              >
                <div className="text-blue-500 mb-3">
                  <i className={`${stat.icon} text-2xl`}></i>
                </div>
                <h3 className="text-3xl font-bold text-gray-800">{stat.value}</h3>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ENHANCED FEATURES SECTION WITH BOXES AND MODALS */}
     {/* ENHANCED FEATURES SECTION WITH IMPROVED BOXES */}
     <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12" data-aos="fade-up">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 font-semibold text-xs rounded-full mb-3">POWERFUL FEATURES</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Our comprehensive system is designed to handle all aspects of
              hospital management with ease and precision
            </p>
            
            {/* Feature Category Tabs - Fixed Dynamic Classes */}
            <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 p-1.5 bg-gray-100 rounded-full shadow-inner">
              {Object.keys(featureCategories).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFeatureCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm sm:text-base font-medium transition-all duration-300 ${
                    activeFeatureCategory === category
                      ? `${getCategoryColorClass('bg', 600, category)} text-white shadow`
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                  aria-pressed={activeFeatureCategory === category}
                >
                  <i className={`fas ${featureCategories[category].icon} mr-2`}></i>
                  {featureCategories[category].title}
                </button>
              ))}
            </div>
            
            {/* Category Description */}
            <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
              {featureCategories[activeFeatureCategory].description}
            </p>
          </div>

          {/* Improved Feature Boxes Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {featureCategories[activeFeatureCategory].features.map((feature, index) => (
              <div
                key={feature.id}
                className="feature-box-container rounded-xl h-full"
                data-aos="fade-up"
                data-aos-delay={index * 100}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`feature-box h-full rounded-xl ${hoveredFeature === feature.id ? 'is-flipped' : ''}`}>
                  {/* Front Card */}
                  <div className="feature-face feature-front">
                    <div className="bg-white rounded-xl p-6 h-full border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between">
                          <div className={`${getCategoryColorClass('bg', 100)} ${getCategoryColorClass('text', 600)} w-14 h-14 rounded-full flex items-center justify-center mb-6`}>
                            <i className={`fas ${feature.icon} text-2xl`}></i>
                          </div>
                          
                          {feature.badge && (
                            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getBadgeColorClass(feature.badge, 'bg')} ${getBadgeColorClass(feature.badge, 'text')}`}>
                              {feature.badge}
                            </span>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">
                          {feature.title}
                        </h3>
                        
                        <p className="text-gray-600 mb-6">
                          {feature.description}
                        </p>
                      </div>
                      
                      <div>
                        <button 
                          onClick={() => openFeatureModal(feature)}
                          className={`${getCategoryColorClass('bg', 50)} ${getCategoryColorClass('text', 600)} ${getCategoryColorClass('hover', 100)} px-4 py-2 rounded-lg font-medium transition-colors w-full flex items-center justify-center group`}
                          aria-label={`Learn more about ${feature.title}`}
                        >
                          <span>Learn More</span>
                          <i className="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Back Card */}
                  <div className="feature-face feature-back">
                    <div className={`${getCategoryColorClass('bg', 600)} rounded-xl p-6 h-full shadow-xl flex flex-col justify-between text-white`}>
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <div className="bg-white/20 w-14 h-14 rounded-full flex items-center justify-center">
                            <i className={`fas ${feature.icon} text-2xl`}></i>
                          </div>
                          <h3 className="text-xl font-semibold">
                            {feature.title}
                          </h3>
                        </div>
                        
                        <h4 className="text-lg font-medium mb-4 text-white/90">Key Benefits:</h4>
                        <ul className="space-y-2 mb-6">
                          {feature.benefits.slice(0, 2).map((benefit, idx) => (
                            <li key={idx} className="flex items-start">
                              <i className="fas fa-check-circle mt-1 mr-2 text-white/80"></i>
                              <span className="text-white/90">{benefit}</span>
                            </li>
                          ))}
                          <li className="text-white/80 italic text-sm">...and more benefits</li>
                        </ul>
                      </div>
                      
                      <div>
                        <button 
                          onClick={() => openFeatureModal(feature)}
                          className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full flex items-center justify-center group"
                          aria-label={`View details of ${feature.title}`}
                        >
                          <span>View Details</span>
                          <i className="fas fa-external-link-alt ml-2"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Action Banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center shadow-xl" data-aos="fade-up">
            <h3 className="text-2xl font-bold mb-4">Ready to streamline your healthcare operations?</h3>
            <p className="text-blue-100 mb-6 max-w-3xl mx-auto">
              Join over 5,000+ healthcare facilities already using MedCare HMS to enhance patient care and improve efficiency.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-lg mx-auto">
              <button
                onClick={() => navigate("/signup")}
                className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium text-lg transition-all hover:shadow-lg"
              >
                Start Free Trial
              </button>
              <button
                onClick={() => {}}
                className="bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium text-lg transition-all"
              >
                Request Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-20 px-4 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-100 to-transparent opacity-40"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-block px-3 py-1 bg-green-100 text-green-600 font-semibold text-xs rounded-full mb-3">OUR SERVICES</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Comprehensive Healthcare Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced healthcare services integrated with our modern management system
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Outpatient Services",
                description:
                  "Manage regular check-ups, consultations, and follow-ups effortlessly.",
                icon: "fas fa-stethoscope",
                color: "blue",
              },
              {
                title: "Emergency Care",
                description:
                  "Quick access to patient records during critical care situations.",
                icon: "fas fa-ambulance",
                color: "red",
              },
              {
                title: "Diagnostic Services",
                description:
                  "Track and manage lab tests and diagnostic procedures in one place.",
                icon: "fas fa-microscope",
                color: "purple",
              },
              {
                title: "Pharmacy Management",
                description:
                  "Streamline medication dispensing with our integrated pharmacy system.",
                icon: "fas fa-pills",
                color: "green",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={index * 100}
              >
                <div className={`h-2 bg-${service.color}-500 w-full`}></div>
                <div className="p-8">
                  <div className={`bg-${service.color}-100 text-${service.color}-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                    <i className={`${service.icon} text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button className="text-blue-600 font-medium flex items-center mt-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                    Learn more <i className="fas fa-arrow-right ml-2"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section id="testimonials" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 font-semibold text-xs rounded-full mb-3">TESTIMONIALS</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our users have to say about MedCare HMS
            </p>
          </div>

          <div className="relative overflow-hidden" data-aos="fade-up">
            <div className="flex flex-col items-center">
              {/* Large quote icon */}
              <div className="text-blue-100 mb-8">
                <i className="fas fa-quote-left text-6xl"></i>
              </div>
              
              <div className="relative w-full">
                <div className="transition-opacity duration-500 text-center px-4 sm:px-16 md:px-24">
                  <p className="text-xl md:text-2xl text-gray-700 italic leading-relaxed mb-8">
                    "{testimonials[activeTestimonial].quote}"
                  </p>
                  
                  <div className="flex flex-col items-center">
                    <div className="mb-4 w-20 h-20 rounded-full overflow-hidden border-4 border-blue-100 shadow-md">
                      <img
                        src={testimonials[activeTestimonial].avatar}
                        alt={testimonials[activeTestimonial].name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-gray-800 text-lg">
                        {testimonials[activeTestimonial].name}
                      </p>
                      <p className="text-blue-600">
                        {testimonials[activeTestimonial].role}
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Navigation buttons */}
                <button 
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all text-blue-600 hover:text-blue-700 focus:outline-none"
                  onClick={() => setActiveTestimonial(prev => prev === 0 ? testimonials.length - 1 : prev - 1)}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button 
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md hover:shadow-lg transition-all text-blue-600 hover:text-blue-700 focus:outline-none"
                  onClick={() => setActiveTestimonial(prev => prev === testimonials.length - 1 ? 0 : prev + 1)}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              
              {/* Dots indicator */}
              <div className="flex space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      activeTestimonial === index ? "bg-blue-600 w-6" : "bg-gray-300"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About CTA Section */}
      <section
        id="about"
        className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-white opacity-10 transform -skew-x-12 animate-pulse-slow"></div>
          <div className="absolute top-0 right-0 w-1/4 h-full bg-white opacity-10 transform skew-x-12 animate-pulse-slow animation-delay-1000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <div className="md:w-1/2" data-aos="fade-right">
              <h2 className="text-3xl font-bold mb-6">
                Ready to transform your healthcare management?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join thousands of healthcare professionals who have streamlined
                their operations with MedCare HMS. Get started today and experience
                the difference our platform can make for your facility.
              </p>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-lg inline-block transform transition-transform hover:scale-105 hover:shadow-lg"
                >
                  Get Started Today
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="bg-transparent border border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium text-lg inline-block transform transition-transform hover:scale-105"
                >
                  Schedule Demo
                </button>
              </div>
              
              <div className="mt-8 flex items-center">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(num => (
                    <div key={num} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img
                        src={`https://randomuser.me/api/portraits/men/${num + 10}.jpg`}
                        alt="User"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <p className="text-sm text-white/90 font-medium">Joined by 500+ healthcare facilities</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-12 md:mt-0" data-aos="fade-left">
              <div className="relative">
                {/* Background decoration */}
                <div className="absolute -top-4 -left-4 w-full h-full bg-blue-400 rounded-xl transform -rotate-3 opacity-30"></div>
                
                {/* Image */}
                <img
                  src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  alt="Modern Hospital"
                  className="relative rounded-xl shadow-2xl w-full h-auto object-cover object-center md:h-[400px]"
                />
                
                {/* Stat cards */}
                <div className="absolute -bottom-5 -right-5 bg-white p-4 rounded-lg shadow-lg transform rotate-3">
                  <p className="text-blue-600 font-bold text-xl">98%</p>
                  <p className="text-gray-700 text-sm">Customer Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer id="contact" className="bg-gray-800 text-gray-300 py-16 px-4 relative">
        {/* Back to top button */}
        <button 
          onClick={scrollToTop}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
        >
          <i className="fas fa-chevron-up"></i>
        </button>
        
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div data-aos="fade-up" data-aos-delay="0">
            <div className="flex items-center mb-6">
              <img
                src={hospitalLogo}
                alt="MedCare Logo"
                className="h-10 w-10 object-contain mr-3"
              />
              <span className="text-xl font-bold text-white">MedCare HMS</span>
            </div>
            <p className="mb-6 text-gray-400 leading-relaxed">
              Modern hospital management solution for healthcare institutions of
              all sizes. Streamline operations and improve patient care with our advanced system.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-gray-700 hover:bg-blue-600 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="bg-gray-700 hover:bg-blue-400 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="bg-gray-700 hover:bg-blue-700 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-white transition-all hover:pl-1 duration-200 block flex items-center text-gray-400"
                >
                  <i className="fas fa-chevron-right text-xs mr-2 text-blue-400"></i> Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="hover:text-white transition-all hover:pl-1 duration-200 block flex items-center text-gray-400"
                >
                  <i className="fas fa-chevron-right text-xs mr-2 text-blue-400"></i> Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("services")}
                  className="hover:text-white transition-all hover:pl-1 duration-200 block flex items-center text-gray-400"
                >
                  <i className="fas fa-chevron-right text-xs mr-2 text-blue-400"></i> Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("testimonials")}
                  className="hover:text-white transition-all hover:pl-1 duration-200 block flex items-center text-gray-400"
                >
                  <i className="fas fa-chevron-right text-xs mr-2 text-blue-400"></i> Testimonials
                </button>
              </li>
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              Support
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all hover:pl-1 duration-200 block flex items-center text-gray-400"
                >
                  <i className="fas fa-question-circle text-xs mr-2 text-blue-400"></i> Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all hover:pl-1 duration-200 block flex items-center text-gray-400"
                >
                  <i className="fas fa-file-alt text-xs mr-2 text-blue-400"></i> Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all hover:pl-1 duration-200 block flex items-center text-gray-400"
                >
                  <i className="fas fa-shield-alt text-xs mr-2 text-blue-400"></i> Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-all hover:pl-1 duration-200 block flex items-center text-gray-400"
                >
                  <i className="fas fa-gavel text-xs mr-2 text-blue-400"></i> Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg font-semibold mb-6 text-white relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-blue-500"></span>
            </h3>
            <ul className="space-y-4">
              <li className="flex hover:translate-x-1 transition-transform duration-200">
                <i className="fas fa-map-marker-alt mt-1 mr-3 text-blue-400"></i>
                <span>123 Healthcare Avenue, Medical District, City</span>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <i className="fas fa-phone mr-3 text-blue-400"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <i className="fas fa-envelope mr-3 text-blue-400"></i>
                <span>info@medcarehms.com</span>
              </li>
              
              {/* Newsletter form */}
              <li className="mt-6 pt-6 border-t border-gray-700">
                <form className="mt-4">
                  <label className="block text-sm font-medium mb-2">Subscribe to our newsletter</label>
                  <div className="flex">
                    <input 
                      type="email" 
                      placeholder="Your email" 
                      className="bg-gray-700 text-white placeholder-gray-400 rounded-l-lg px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg transition-colors"
                    >
                      <i className="fas fa-paper-plane"></i>
                    </button>
                  </div>
                </form>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center text-sm"
          data-aos="fade-up"
        >
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} MedCare HMS. All rights reserved. | Designed with <i className="fas fa-heart text-red-500"></i>
          </p>
        </div>
      </footer>
      
      {/* Add CSS animations */}
      <style jsx ='true'>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 5s ease-in-out 1s infinite;
        }
        
        .animate-float-slow {
          animation: float 6s ease-in-out 0.5s infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        /* Fixed 3D Card Flip Effect */
        .feature-box-container {
          perspective: 1000px;
          height: 450px;
        }
        
        .feature-box {
          position: relative;
          transition: transform 0.8s;
          transform-style: preserve-3d;
        }
        
        .feature-box.is-flipped {
          transform: rotateY(180deg);
        }
        
        .feature-face {
          position: absolute;
          width: 100%;
          height: 100%;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          overflow: hidden;
        }
        
        .feature-front {
          transform: rotateY(0deg);
        }
        
        .feature-back {
          transform: rotateY(180deg);
        }
        
        /* Modal animation */
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
        
        /* Hover effects */
        @media (hover: hover) {
          .feature-box-container:hover .feature-box {
            transform: rotateY(180deg);
          }
          
          .feature-box.is-flipped:hover {
            transform: rotateY(180deg) scale(1.03);
          }
          
          .feature-box:not(.is-flipped):hover {
            transform: scale(1.03);
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomePage;