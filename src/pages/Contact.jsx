import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Add Font Awesome CSS
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.rel = 'stylesheet';
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(fontAwesomeLink);

export default function ContactUs() {

  const [loading, setLoading] = useState(false);

  const [captcha, setCaptcha] = useState({});
  const [captchaInput, setCaptchaInput] = useState("");

  const [startTime, setStartTime] = useState(Date.now());

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    website: "" // honeypot
  });

  const [errors, setErrors] = useState({});

  /* Generate simple math captcha */

  const generateCaptcha = () => {

    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;

    setCaptcha({
      question: `${num1} + ${num2}`,
      answer: num1 + num2
    });

  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  /* Validation */

  const validate = () => {

    let temp = {};

    if (form.name.trim().length < 3)
      temp.name = "Name must be at least 3 characters";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email))
      temp.email = "Enter valid email";

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(form.phone))
      temp.phone = "Enter valid phone number (10-15 digits)";

    if (form.message.trim().length < 10)
      temp.message = "Message must be at least 10 characters";

    if (parseInt(captchaInput) !== captcha.answer)
      temp.captcha = "Incorrect captcha answer";

    setErrors(temp);

    return Object.keys(temp).length === 0;

  };

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    /* Honeypot check */

    if (form.website !== "") {
      return;
    }

    /* Time check */

    if (Date.now() - startTime < 3000) {
      toast.error("Submission too fast. Try again.");
      return;
    }

    if (!validate()) {
      toast.error("Please fix the form errors");
      return;
    }

    setLoading(true);

    try {

      /* simulate API call */

      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: "",
        website: ""
      });

      setCaptchaInput("");

      generateCaptcha();

      setStartTime(Date.now());

    } catch (error) {

      toast.error("Something went wrong");

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="bg-gray-50 min-h-screen py-16 px-6">

      <ToastContainer position="top-right" />

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="text-center mb-14">

          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Contact Us
          </h1>

          <p className="text-gray-600">
            Have questions? Reach out to our support team.
          </p>

        </div>

        {/* Contact Cards */}

        <div className="grid md:grid-cols-3 gap-8 mb-16">

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
            <i className="fas fa-envelope text-primary-600 text-3xl mb-4"></i>
            <h3 className="font-semibold text-lg mb-1">Email</h3>
            <p className="text-gray-600">support@yourdomain.com</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
            <i className="fas fa-phone text-green-600 text-3xl mb-4"></i>
            <h3 className="font-semibold text-lg mb-1">Phone</h3>
            <p className="text-gray-600">+91 98765 43210</p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition">
            <i className="fas fa-location-dot text-red-600 text-3xl mb-4"></i>
            <h3 className="font-semibold text-lg mb-1">Address</h3>
            <p className="text-gray-600">
              Ujjain, Madhya Pradesh<br/>
              India
            </p>
          </div>

        </div>

        {/* Form + Map */}

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Form */}

          <div className="bg-white rounded-xl shadow-md p-10">

            <h2 className="text-2xl font-semibold mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit}>

              {/* Honeypot */}

              <input
                type="text"
                name="website"
                value={form.website}
                onChange={handleChange}
                className="hidden"
              />

              {/* Name */}

              <div className="mb-6">

                <label className="block text-gray-600 mb-2 text-left">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 text-left"
                />

                {errors.name &&
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.name}</p>
                }

              </div>

              {/* Email */}

              <div className="mb-6">

                <label className="block text-gray-600 mb-2 text-left">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 text-left"
                />

                {errors.email &&
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.email}</p>
                }

              </div>

              {/* Phone */}

              <div className="mb-6">

                <label className="block text-gray-600 mb-2 text-left">
                  Phone
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 text-left"
                />

                {errors.phone &&
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.phone}</p>
                }

              </div>

              {/* Message */}

              <div className="mb-6">

                <label className="block text-gray-600 mb-2 text-left">
                  Message
                </label>

                <textarea
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-3 text-left"
                />

                {errors.message &&
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.message}</p>
                }

              </div>

              {/* Custom Captcha */}

              <div className="mb-6">

                <label className="block text-gray-600 mb-2 text-left">
                  Human Verification: {captcha.question} = ?
                </label>

                <input
                  type="number"
                  value={captchaInput}
                  onChange={(e) => setCaptchaInput(e.target.value)}
                  className="w-full border rounded-lg px-4 py-3 text-left"
                />

                {errors.captcha &&
                  <p className="text-red-500 text-sm mt-1 text-left">{errors.captcha}</p>
                }

              </div>

              {/* Submit */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 flex justify-center items-center"
              >

                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Sending...
                  </>
                ) : (
                  "Send Message"
                )}

              </button>

            </form>

          </div>

          {/* Google Map */}

          <div className="rounded-xl overflow-hidden shadow-md">

            <iframe
              title="map"
              src="https://maps.google.com/maps?q=ujjain&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full min-h-[450px]"
              loading="lazy"
            />

          </div>

        </div>

      </div>

    </div>

  );

}
