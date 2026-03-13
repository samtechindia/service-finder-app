import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Button,
  Card,
  Input,
  Avatar,
  RatingStars,
  SkeletonLoader
} from "../components/ui";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import providersData from "../mock/providers.json";

const Booking = () => {

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [bookingData, setBookingData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    date: "",
    time: "",
    description: "",
    urgency: "normal"
  });

  const [errors, setErrors] = useState({});

  /* ---------------- Load Provider ---------------- */

  useEffect(() => {

    const providerId = searchParams.get("provider");

    if (providerId) {
      const foundProvider = providersData.find(
        (p) => p.id === parseInt(providerId)
      );
      setProvider(foundProvider);
    }

    setLoading(false);

  }, [searchParams]);

  /* ---------------- Validation ---------------- */

  const validateForm = () => {

    const newErrors = {};

    if (!bookingData.name.trim())
      newErrors.name = "Name is required";

    if (!bookingData.email.trim())
      newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(bookingData.email))
      newErrors.email = "Invalid email";

    if (!bookingData.phone.trim())
      newErrors.phone = "Phone required";
    else if (!/^\d{10}$/.test(bookingData.phone.replace(/\D/g, "")))
      newErrors.phone = "Phone must be 10 digits";

    if (!bookingData.address.trim())
      newErrors.address = "Address required";

    if (!bookingData.serviceType)
      newErrors.serviceType = "Select service type";

    if (!bookingData.date)
      newErrors.date = "Date required";

    if (!bookingData.time)
      newErrors.time = "Time required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;

  };

  /* ---------------- Input Change ---------------- */

  const handleInputChange = (e) => {

    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }

  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = (e) => {

    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the form errors");
      return;
    }

    setSubmitting(true);

    setTimeout(() => {

      setSubmitting(false);

      toast.success("Service booked successfully!");

      setBookingData({
        name: "",
        email: "",
        phone: "",
        address: "",
        serviceType: "",
        date: "",
        time: "",
        description: "",
        urgency: "normal"
      });

    }, 2000);

  };

  /* ---------------- Options ---------------- */

  const serviceTypes = provider
    ? [
        provider.service,
        `Emergency ${provider.service}`,
        `Consultation - ${provider.service}`,
        `Maintenance - ${provider.service}`
      ]
    : [
        "Electrician",
        "Plumber",
        "AC Repair",
        "Cleaning",
        "Carpentry",
        "Painting"
      ];

  const timeSlots = [
    "9:00 AM","10:00 AM","11:00 AM","12:00 PM",
    "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"
  ];

  /* ---------------- Loading Screen ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <SkeletonLoader variant="card" className="w-96 h-60"/>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-50 py-14 px-4 relative">

      <ToastContainer position="top-right" />

      {/* Submit Loader */}

      {submitting && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="text-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl text-blue-600"></i>
            <p className="mt-3 text-gray-600">Processing Booking...</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Book a Service
          </h1>
          <p className="text-gray-600">
            Schedule your appointment quickly and easily
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* FORM */}

          <div className="lg:col-span-2">

            <Card className="p-8 shadow-lg rounded-2xl">

              {provider && (

                <div className="flex items-center gap-4 mb-8 border-b pb-6">

                  <Avatar src={provider.avatar} size="lg"/>

                  <div className="text-left">

                    <h3 className="font-semibold text-lg">
                      {provider.name}
                    </h3>

                    <p className="text-gray-600">
                      {provider.service}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={provider.rating}/>
                      <span className="text-sm text-gray-500">
                        ({provider.reviews})
                      </span>
                    </div>

                  </div>

                </div>

              )}

              <form onSubmit={handleSubmit} className="space-y-8 text-left">

                {/* Contact */}

                <div>

                  <h3 className="font-semibold text-lg mb-4">
                    Contact Information
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">

                    <div className="text-left">
                      <label className="block mb-1 font-medium text-left">Full Name</label>
                      <Input name="name" value={bookingData.name} onChange={handleInputChange}/>
                      {errors.name && <p className="text-red-500 text-sm mt-1 text-left">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-left">Email</label>
                      <Input type="email" name="email" value={bookingData.email} onChange={handleInputChange}/>
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-left">Phone</label>
                      <Input name="phone" value={bookingData.phone} onChange={handleInputChange}/>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-left">Service Address</label>
                      <Input name="address" value={bookingData.address} onChange={handleInputChange}/>
                      {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                    </div>

                  </div>

                </div>

                {/* Service */}

                <div>

                  <h3 className="font-semibold text-lg mb-4">
                    Service Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">

                    <div>
                      <label className="block mb-1 font-medium text-left">Service Type</label>
                      <select
                        name="serviceType"
                        value={bookingData.serviceType}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="">Select service</option>
                        {serviceTypes.map((s,i)=>(
                          <option key={i}>{s}</option>
                        ))}
                      </select>
                      {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-left">Urgency</label>
                      <select
                        name="urgency"
                        value={bookingData.urgency}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="normal">Normal</option>
                        <option value="urgent">Urgent</option>
                        <option value="emergency">Emergency</option>
                      </select>
                    </div>

                  </div>

                </div>

                {/* Time */}

                <div>

                  <h3 className="font-semibold text-lg mb-4">
                    Preferred Time
                  </h3>

                  <div className="grid md:grid-cols-2 gap-4">

                    <div>
                      <label className="block mb-1 font-medium text-left">Date</label>
                      <Input
                        type="date"
                        name="date"
                        value={bookingData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
                    </div>

                    <div>
                      <label className="block mb-1 font-medium text-left">Time</label>
                      <select
                        name="time"
                        value={bookingData.time}
                        onChange={handleInputChange}
                        className="input"
                      >
                        <option value="">Select time</option>
                        {timeSlots.map((t,i)=>(
                          <option key={i}>{t}</option>
                        ))}
                      </select>
                      {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
                    </div>

                  </div>

                </div>

                {/* Description */}

                <div>
                  <label className="block mb-1 font-medium text-left">Description</label>
                  <textarea
                    name="description"
                    rows="4"
                    value={bookingData.description}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg p-3"
                  />
                </div>

                {/* Buttons */}

                <div className="flex gap-4 pt-4">

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="px-8 py-3"
                  >
                    Book Service
                  </Button>

                  <Button
                    variant="outline"
                    onClick={()=>navigate("/providers")}
                  >
                    Back
                  </Button>

                </div>

              </form>

            </Card>

          </div>

          {/* SIDEBAR */}

          <div className="space-y-6">

            <Card className="p-6">

              <h3 className="font-semibold mb-4 text-left">
                Estimated Price
              </h3>

              <div className="flex justify-between mb-2">
                <span>Base Rate</span>
                <span>${provider?.price || 50}/hr</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Duration</span>
                <span>2-3 hrs</span>
              </div>

              <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span className="text-primary-600">
                  ${provider?.price ? provider.price*2 : 100}
                  -
                  ${provider?.price ? provider.price*3 : 150}
                </span>
              </div>

            </Card>

            <Card className="p-6">

              <h3 className="font-semibold mb-4 text-left">
                Why Choose Us
              </h3>

              <ul className="space-y-3 text-sm text-gray-600 text-left">

                <li className="flex gap-2">
                  <span>✔</span>
                  <span>Verified professionals</span>
                </li>

                <li className="flex gap-2">
                  <span>✔</span>
                  <span>24/7 customer support</span>
                </li>

                <li className="flex gap-2">
                  <span>✔</span>
                  <span>Satisfaction guarantee</span>
                </li>

              </ul>

            </Card>

          </div>

        </div>

      </div>

    </div>

  );

};

export default Booking;