import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion } from "framer-motion"

import Card from "../components/ui/Card"
import Button from "../components/ui/Button"
import Input from "../components/ui/Input"
import Badge from "../components/ui/Badge"

const bookServiceSchema = z.object({
  service: z.string().min(1, "Please select a service"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
})

const BookService = () => {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const providerId = searchParams.get("provider")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableProviders, setAvailableProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [isLoadingProviders, setIsLoadingProviders] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(bookServiceSchema)
  })

  const watchedService = watch("service")

  const services = [
    { id: "plumbing", name: "Plumbing", icon: "🔧" },
    { id: "electrical", name: "Electrical", icon: "⚡" },
    { id: "cleaning", name: "Cleaning", icon: "🧹" },
    { id: "gardening", name: "Gardening", icon: "🌱" },
    { id: "painting", name: "Painting", icon: "🎨" },
    { id: "carpentry", name: "Carpentry", icon: "🔨" },
    { id: "hvac", name: "HVAC", icon: "❄️" },
    { id: "moving", name: "Moving", icon: "🚚" }
  ]

  const mockProviders = [
    { id: 1, name: "John Smith", rating: 4.8, reviews: 124, price: "$45-65/hr", verified: true },
    { id: 2, name: "Sarah Johnson", rating: 4.9, reviews: 89, price: "$50-70/hr", verified: true },
    { id: 3, name: "Mike Wilson", rating: 4.6, reviews: 67, price: "$40-55/hr", verified: false }
  ]

  const timeSlots = [
    "9:00 AM","10:00 AM","11:00 AM","12:00 PM",
    "1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM"
  ]

  useEffect(() => {

    if (watchedService) {

      setSelectedProvider(null)
      setIsLoadingProviders(true)

      setTimeout(() => {
        setAvailableProviders(mockProviders)
        setIsLoadingProviders(false)
      }, 500)

    } else {
      setAvailableProviders([])
    }

  }, [watchedService])

  useEffect(() => {

    if (providerId) {

      const provider = mockProviders.find(p => p.id === parseInt(providerId))

      if (provider) {
        setSelectedProvider(provider)
        setValue("service", "plumbing")
      }

    }

  }, [providerId, setValue])

  const onSubmit = (data) => {

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      navigate("/customer/requests?booking=success")
    }, 2000)

  }

  return (

    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-6xl mx-auto px-4">

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Book a Service</h1>
          <p className="text-gray-600 mt-2">
            Find and book the best service providers
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* LEFT SECTION */}

            <div className="lg:col-span-2 space-y-6">

              {/* SERVICE SELECT */}

              <Card>

                <div className="p-6">

                  <h2 className="text-lg font-semibold mb-4">
                    Select Service
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                    {services.map(service => {

                      const isSelected = watchedService === service.id

                      return (

                        <motion.label
                          key={service.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer
                          ${isSelected
                            ? "border-primary-500 bg-primary-50"
                            : "border-gray-200 bg-white"}
                          `}
                        >

                          <input
                            type="radio"
                            value={service.id}
                            {...register("service")}
                            className="hidden"
                          />

                          <span className="text-3xl">{service.icon}</span>
                          <span className="text-sm font-medium mt-1">
                            {service.name}
                          </span>

                        </motion.label>

                      )

                    })}

                  </div>

                  {errors.service && (
                    <p className="text-red-500 text-sm mt-2">
                      {errors.service.message}
                    </p>
                  )}

                </div>

              </Card>

              {/* DESCRIPTION */}

              <Card>

                <div className="p-6 space-y-4">

                  <h2 className="text-lg font-semibold">
                    Service Details
                  </h2>

                  <textarea
                    {...register("description")}
                    rows={4}
                    className="w-full border rounded-lg p-3"
                    placeholder="Describe the problem..."
                  />

                  {errors.description && (
                    <p className="text-red-500 text-sm">
                      {errors.description.message}
                    </p>
                  )}

                </div>

              </Card>

              {/* LOCATION */}

              <Card>

                <div className="p-6 space-y-6">

                  <h2 className="text-lg font-semibold">
                    Location & Schedule
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">

                    <div>

                      <Input
                        {...register("address")}
                        placeholder="Address"
                      />

                      {errors.address && (
                        <p className="text-red-500 text-sm">
                          {errors.address.message}
                        </p>
                      )}

                    </div>

                    <div>

                      <Input
                        {...register("city")}
                        placeholder="City"
                      />

                      {errors.city && (
                        <p className="text-red-500 text-sm">
                          {errors.city.message}
                        </p>
                      )}

                    </div>

                  </div>

                  <div className="grid md:grid-cols-2 gap-6">

                    <Input
                      type="date"
                      {...register("date")}
                      min={new Date().toISOString().split("T")[0]}
                    />

                    <div className="grid grid-cols-3 gap-2">

                      {timeSlots.map(slot => (

                        <label key={slot} className="cursor-pointer">

                          <input
                            type="radio"
                            value={slot}
                            {...register("time")}
                            className="hidden"
                          />

                          <div className={`p-2 text-center border rounded-lg
                          ${watch("time") === slot
                            ? "bg-primary-600 text-white"
                            : "bg-white"}
                          `}>
                            {slot}
                          </div>

                        </label>

                      ))}

                    </div>

                  </div>

                </div>

              </Card>

            </div>

            {/* RIGHT SIDEBAR */}

            <div className="space-y-6">

              {watchedService && (

                <Card>

                  <div className="p-6">

                    <h2 className="font-semibold mb-4">
                      Available Providers
                    </h2>

                    {isLoadingProviders ? (

                      <p>Loading providers...</p>

                    ) : (

                      <div className="space-y-3">

                        {availableProviders.map(provider => (

                          <label
                            key={provider.id}
                            className="block cursor-pointer"
                          >

                            <input
                              type="radio"
                              className="hidden"
                              checked={selectedProvider?.id === provider.id}
                              onChange={() => setSelectedProvider(provider)}
                            />

                            <div className={`p-4 border rounded-xl
                            ${selectedProvider?.id === provider.id
                              ? "border-primary-500 bg-primary-50"
                              : "border-gray-200"}
                            `}>

                              <div className="flex justify-between">

                                <span>{provider.name}</span>

                                {provider.verified && (
                                  <Badge>Verified</Badge>
                                )}

                              </div>

                              <p className="text-sm text-gray-600">
                                ⭐ {provider.rating}
                              </p>

                            </div>

                          </label>

                        ))}

                      </div>

                    )}

                  </div>

                </Card>

              )}

              {/* SUMMARY */}

              <Card>

                <div className="p-6">

                  <h2 className="font-semibold mb-4">
                    Booking Summary
                  </h2>

                  <div className="flex justify-between mb-2">
                    <span>Service</span>
                    <span>
                      {services.find(s => s.id === watchedService)?.name || "-"}
                    </span>
                  </div>

                  {selectedProvider && (

                    <div className="flex justify-between mb-4">
                      <span>Provider</span>
                      <span>{selectedProvider.name}</span>
                    </div>

                  )}

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!watchedService || !selectedProvider || isSubmitting}
                    loading={isSubmitting}
                  >
                    Confirm Booking
                  </Button>

                </div>

              </Card>

            </div>

          </div>

        </form>

      </div>

    </div>

  )

}

export default BookService;