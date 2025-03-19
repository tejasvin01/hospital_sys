import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const WelcomePage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <header className="bg-white shadow-sm animate-fadeIn">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img
                src="/images/hospital-logo.png"
                alt="MedCare Logo"
                className="h-12 w-12 object-contain mr-3 animate-pulse"
              />
              <span className="text-2xl font-bold text-blue-600">
                MedCare HMS
              </span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-105 transform"
              >
                Features
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-105 transform"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-105 transform"
              >
                About Us
              </a>
              <a
                href="#contact"
                className="text-gray-600 hover:text-blue-600 transition-colors hover:scale-105 transform"
              >
                Contact
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              {/* Replace Link with button using navigate */}
              <button
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-800 font-medium transition-transform hover:scale-105 bg-transparent border-0"
              >
                Log In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-transform hover:scale-105"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0" data-aos="fade-right">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-6">
              Modern Healthcare Management{" "}
              <span className="text-blue-600 animate-pulse">Simplified</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Streamline your hospital operations, enhance patient care, and
              improve efficiency with our comprehensive hospital management
              system.
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
                onClick={() => navigate("/signup")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-lg font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1"
              >
                Get Started
              </button>
              <button
                onClick={() => navigate("/login")}
                className="border border-blue-600 text-blue-600 hover:bg-blue-50 text-center px-6 py-3 rounded-lg font-medium text-lg transition-all hover:shadow-lg transform hover:-translate-y-1"
              >
                Login
              </button>
            </div>
          </div>
          <div className="md:w-1/2" data-aos="fade-left" data-aos-delay="200">
            <img
              src="src/public/images/hospital1.webp"
              alt="Healthcare Team Consultation"
              className="rounded-xl shadow-2xl hover:shadow-3xl transition-shadow transform hover:scale-[1.02] w-full h-auto object-cover object-center md:h-[400px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive system is designed to handle all aspects of
              hospital management with ease
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-user-md",
                title: "Doctor Management",
                description:
                  "Efficiently manage doctor schedules, specializations, and patient assignments.",
              },
              {
                icon: "fas fa-users",
                title: "Patient Records",
                description:
                  "Securely store and access patient medical history, treatments, and prescriptions.",
              },
              {
                icon: "fas fa-calendar-check",
                title: "Appointment System",
                description:
                  "Streamline booking process with our intuitive appointment scheduling system.",
              },
              {
                icon: "fas fa-file-medical",
                title: "Medical Reports",
                description:
                  "Generate and store comprehensive medical reports with just a few clicks.",
              },
              {
                icon: "fas fa-money-bill-wave",
                title: "Billing & Payments",
                description:
                  "Simplify financial operations with our integrated billing and payment system.",
              },
              {
                icon: "fas fa-chart-line",
                title: "Analytics Dashboard",
                description:
                  "Gain valuable insights with customizable analytics and reporting tools.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-blue-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110 duration-300">
                  <i className={`${feature.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        id="services"
        className="py-16 px-4 bg-blue-50 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-blue-100 animate-pulse-slow opacity-70"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare services integrated with our advanced
              management system
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Outpatient Services",
                description:
                  "Manage regular check-ups, consultations, and follow-ups effortlessly.",
                icon: "fas fa-stethoscope",
              },
              {
                title: "Emergency Care",
                description:
                  "Quick access to patient records during critical care situations.",
                icon: "fas fa-ambulance",
              },
              {
                title: "Diagnostic Services",
                description:
                  "Track and manage lab tests and diagnostic procedures in one place.",
                icon: "fas fa-microscope",
              },
              {
                title: "Pharmacy Management",
                description:
                  "Streamline medication dispensing with our integrated pharmacy system.",
                icon: "fas fa-pills",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-sm flex transform transition-all duration-300 hover:shadow-lg"
                data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
                data-aos-delay={index * 100}
              >
                <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-transform hover:scale-110 duration-300">
                  <i className={`${service.icon} text-2xl`}></i>
                </div>
                <div className="ml-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" data-aos="fade-up">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See what our users have to say about MedCare HMS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "MedCare HMS has transformed our hospital operations. Patient management is now seamless and efficient.",
                name: "Dr. Sarah Johnson",
                role: "Chief Medical Officer",
                avatar: "src/public/images/sarah.jpg",
              },
              {
                quote:
                  "The intuitive interface made training our staff quick and easy. We've saved countless hours on administrative tasks.",
                name: "Michael Chen",
                role: "Hospital Administrator",
                avatar: "src/public/images/chen.jpg",
              },
              {
                quote:
                  "As a doctor, having instant access to patient records has improved my decision-making and quality of care.",
                name: "Dr. Emily Rodriguez",
                role: "Cardiologist",
                avatar: "src/public/images/emily.jpg",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 border border-gray-100 transition-all duration-300 hover:shadow-md transform hover:-translate-y-1"
                data-aos="zoom-in"
                data-aos-delay={index * 150}
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-14 h-14 rounded-full object-cover mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="about"
        className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white relative"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full bg-white opacity-10 transform -skew-x-12 animate-pulse-slow"></div>
          <div className="absolute top-0 right-0 w-1/4 h-full bg-white opacity-10 transform skew-x-12 animate-pulse-slow animation-delay-1000"></div>
        </div>
        <div
          className="max-w-7xl mx-auto text-center relative z-10"
          data-aos="fade-up"
        >
          <h2 className="text-3xl font-bold mb-6">
            Ready to transform your healthcare management?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of healthcare professionals who have streamlined
            their operations with MedCare HMS.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium text-lg inline-block transform transition-transform hover:scale-105 hover:shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-gray-300 py-12 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div data-aos="fade-up" data-aos-delay="0">
            <div className="flex items-center mb-4">
              <img
                src="/images/hospital-logo.png"
                alt="MedCare Logo"
                className="h-10 w-10 object-contain mr-3"
              />
              <span className="text-xl font-bold text-white">MedCare HMS</span>
            </div>
            <p className="mb-4">
              Modern hospital management solution for healthcare institutions of
              all sizes.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transform transition-transform hover:scale-125"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transform transition-transform hover:scale-125"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transform transition-transform hover:scale-125"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors hover:pl-1 duration-200 block"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="hover:text-white transition-colors hover:pl-1 duration-200 block"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="hover:text-white transition-colors hover:pl-1 duration-200 block"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#about"
                  className="hover:text-white transition-colors hover:pl-1 duration-200 block"
                >
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors hover:pl-1 duration-200 block"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors hover:pl-1 duration-200 block"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors hover:pl-1 duration-200 block"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition-colors hover:pl-1 duration-200 block"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start hover:translate-x-1 transition-transform duration-200">
                <i className="fas fa-map-marker-alt mt-1 mr-2"></i>
                <span>123 Healthcare Avenue, Medical District, City</span>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <i className="fas fa-phone mr-2"></i>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center hover:translate-x-1 transition-transform duration-200">
                <i className="fas fa-envelope mr-2"></i>
                <span>info@medcarehms.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto mt-12 pt-8 border-t border-gray-700 text-center text-sm"
          data-aos="fade-up"
        >
          <p>
            &copy; {new Date().getFullYear()} MedCare HMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WelcomePage;
