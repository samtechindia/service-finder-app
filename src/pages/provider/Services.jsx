import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import Alert from '../../components/ui/Alert';
import EmptyState from '../../components/ui/EmptyState';

const serviceSchema = z.object({
  title: z.string().min(3, 'Service title must be at least 3 characters'),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priceType: z.enum(['hourly', 'fixed']),
  priceMin: z.string().min(1, 'Minimum price is required'),
  priceMax: z.string().optional(),
  duration: z.string().min(1, 'Duration is required'),
  availability: z.string().min(1, 'Availability is required'),
  specialties: z.array(z.string()).min(1, 'Add at least one specialty'),
  serviceAreas: z.array(z.string()).min(1, 'Add at least one service area')
});

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [areaInput, setAreaInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    getValues
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      category: '',
      description: '',
      priceType: 'hourly',
      priceMin: '',
      priceMax: '',
      duration: '',
      availability: '',
      specialties: [],
      serviceAreas: []
    }
  });

  const watchedPriceType = watch('priceType');
  const watchedSpecialties = watch('specialties') || [];
  const watchedServiceAreas = watch('serviceAreas') || [];

  const categories = [
    'Plumbing', 'Electrical', 'Cleaning', 'Gardening', 
    'Painting', 'Carpentry', 'HVAC', 'Moving', 'Other'
  ];

  const priceTypes = [
    { value: 'hourly', label: 'Per Hour' },
    { value: 'fixed', label: 'Fixed Price' }
  ];

  const durations = [
    '1-2 hours', '2-4 hours', '4-6 hours', '6-8 hours', 'Full day', 'Multiple days'
  ];

  const availabilityOptions = [
    'Weekdays', 'Weekends', 'Weekdays + Weekends', 'Flexible', '24/7 Emergency'
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setServices([
        {
          id: 1,
          title: 'Emergency Plumbing Repair',
          category: 'Plumbing',
          description: '24/7 emergency plumbing services including pipe repairs, leak detection, and fixture installation.',
          priceType: 'hourly',
          priceMin: 65,
          priceMax: 85,
          duration: '2-4 hours',
          availability: '24/7 Emergency',
          specialties: ['Pipe Repair', 'Leak Detection', 'Emergency Services', 'Fixture Installation'],
          serviceAreas: ['Manhattan', 'Brooklyn', 'Queens'],
          active: true,
          bookingsCount: 47,
          rating: 4.8
        },
        {
          id: 2,
          title: 'Bathroom Renovation',
          category: 'Plumbing',
          description: 'Complete bathroom renovation services including plumbing, fixture installation, and tile work.',
          priceType: 'fixed',
          priceMin: 2500,
          priceMax: 5000,
          duration: 'Multiple days',
          availability: 'Weekdays + Weekends',
          specialties: ['Bathroom Design', 'Fixture Installation', 'Pipe Rerouting', 'Tile Work'],
          serviceAreas: ['Manhattan', 'Brooklyn'],
          active: true,
          bookingsCount: 12,
          rating: 4.9
        },
        {
          id: 3,
          title: 'Drain Cleaning Service',
          category: 'Plumbing',
          description: 'Professional drain cleaning for all types of blockages using advanced equipment.',
          priceType: 'fixed',
          priceMin: 150,
          priceMax: 300,
          duration: '1-2 hours',
          availability: 'Weekdays + Weekends',
          specialties: ['Drain Cleaning', 'Pipe Inspection', 'Blockage Removal'],
          serviceAreas: ['Manhattan', 'Brooklyn', 'Queens', 'Bronx'],
          active: false,
          bookingsCount: 23,
          rating: 4.7
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddSpecialty = () => {
    if (specialtyInput.trim() && !watchedSpecialties.includes(specialtyInput.trim())) {
      setValue('specialties', [...watchedSpecialties, specialtyInput.trim()]);
      setSpecialtyInput('');
    }
  };

  const handleRemoveSpecialty = (specialty) => {
    setValue('specialties', watchedSpecialties.filter(s => s !== specialty));
  };

  const handleAddServiceArea = () => {
    if (areaInput.trim() && !watchedServiceAreas.includes(areaInput.trim())) {
      setValue('serviceAreas', [...watchedServiceAreas, areaInput.trim()]);
      setAreaInput('');
    }
  };

  const handleRemoveServiceArea = (area) => {
    setValue('serviceAreas', watchedServiceAreas.filter(a => a !== area));
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      if (selectedService) {
        // Edit existing service
        setServices(prev => prev.map(s => 
          s.id === selectedService.id 
            ? { ...s, ...data, priceMin: parseInt(data.priceMin), priceMax: data.priceMax ? parseInt(data.priceMax) : null }
            : s
        ));
      } else {
        // Add new service
        const newService = {
          id: Date.now(),
          ...data,
          priceMin: parseInt(data.priceMin),
          priceMax: data.priceMax ? parseInt(data.priceMax) : null,
          active: true,
          bookingsCount: 0,
          rating: 0
        };
        setServices(prev => [...prev, newService]);
      }
      
      setIsSubmitting(false);
      setShowAddModal(false);
      setShowEditModal(false);
      setSelectedService(null);
      reset();
      setSpecialtyInput('');
      setAreaInput('');
    }, 1500);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setValue('title', service.title);
    setValue('category', service.category);
    setValue('description', service.description);
    setValue('priceType', service.priceType);
    setValue('priceMin', service.priceMin.toString());
    setValue('priceMax', service.priceMax?.toString() || '');
    setValue('duration', service.duration);
    setValue('availability', service.availability);
    setValue('specialties', service.specialties);
    setValue('serviceAreas', service.serviceAreas);
    setShowEditModal(true);
  };

  const handleToggleActive = (serviceId) => {
    setServices(prev => prev.map(s => 
      s.id === serviceId ? { ...s, active: !s.active } : s
    ));
  };

  const handleDelete = (serviceId) => {
    if (confirm('Are you sure you want to delete this service?')) {
      setServices(prev => prev.filter(s => s.id !== serviceId));
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <SkeletonLoader className="h-8 w-48 mb-2" />
          <SkeletonLoader className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <SkeletonLoader key={i} className="h-80" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Services</h1>
          <p className="text-gray-600 mt-2">Manage the services you offer to customers</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <EmptyState
          title="No services yet"
          description="Start by adding your first service to attract customers"
          action={
            <Button onClick={() => setShowAddModal(true)}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Service
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={`h-full ${!service.active ? 'opacity-75' : ''}`}>
                <div className="p-6">
                  {/* Service Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                      <Badge variant="outline" className="mt-1">{service.category}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={service.active ? 'success' : 'secondary'} size="sm">
                        {service.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-lg font-bold text-primary-600">
                      ${service.priceMin}
                      {service.priceType === 'hourly' ? '/hr' : ''}
                      {service.priceMax && ` - $${service.priceMax}`}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.duration}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-4">
                      <span>{service.bookingsCount} bookings</span>
                      {service.rating > 0 && (
                        <span>⭐ {service.rating}</span>
                      )}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {service.specialties.slice(0, 3).map((specialty, idx) => (
                      <Badge key={idx} variant="outline" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                    {service.specialties.length > 3 && (
                      <Badge variant="outline" size="sm">
                        +{service.specialties.length - 3}
                      </Badge>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4 border-t border-gray-200">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(service)}
                      className="flex-1"
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleActive(service.id)}
                      className="flex-1"
                    >
                      {service.active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Service Modal */}
      <Modal
        isOpen={showAddModal || showEditModal}
        onClose={() => {
          setShowAddModal(false);
          setShowEditModal(false);
          setSelectedService(null);
          reset();
          setSpecialtyInput('');
          setAreaInput('');
        }}
        title={selectedService ? 'Edit Service' : 'Add New Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Title
              </label>
              <Input
                {...register('title')}
                placeholder="e.g., Emergency Plumbing Repair"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select {...register('category')} className="input-field">
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="input-field"
              placeholder="Describe your service in detail..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Type
              </label>
              <select {...register('priceType')} className="input-field">
                {priceTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {watchedPriceType === 'hourly' ? 'Hourly Rate' : 'Fixed Price'}
              </label>
              <div className="flex space-x-2">
                <Input
                  {...register('priceMin')}
                  placeholder="Min price"
                  type="number"
                />
                {watchedPriceType === 'fixed' && (
                  <Input
                    {...register('priceMax')}
                    placeholder="Max price"
                    type="number"
                  />
                )}
              </div>
              {errors.priceMin && (
                <p className="text-red-500 text-sm mt-1">{errors.priceMin.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Typical Duration
              </label>
              <select {...register('duration')} className="input-field">
                <option value="">Select duration</option>
                {durations.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
              {errors.duration && (
                <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Availability
              </label>
              <select {...register('availability')} className="input-field">
                <option value="">Select availability</option>
                {availabilityOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.availability && (
                <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialties
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                placeholder="Add a specialty"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSpecialty())}
              />
              <Button type="button" onClick={handleAddSpecialty}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchedSpecialties.map((specialty, idx) => (
                <Badge key={idx} variant="outline">
                  {specialty}
                  <button
                    type="button"
                    onClick={() => handleRemoveSpecialty(specialty)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            {errors.specialties && (
              <p className="text-red-500 text-sm mt-1">{errors.specialties.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Areas
            </label>
            <div className="flex space-x-2 mb-3">
              <Input
                value={areaInput}
                onChange={(e) => setAreaInput(e.target.value)}
                placeholder="Add a service area"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddServiceArea())}
              />
              <Button type="button" onClick={handleAddServiceArea}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {watchedServiceAreas.map((area, idx) => (
                <Badge key={idx} variant="outline">
                  {area}
                  <button
                    type="button"
                    onClick={() => handleRemoveServiceArea(area)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
            {errors.serviceAreas && (
              <p className="text-red-500 text-sm mt-1">{errors.serviceAreas.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                setSelectedService(null);
                reset();
                setSpecialtyInput('');
                setAreaInput('');
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isSubmitting}>
              {isSubmitting ? 'Saving...' : (selectedService ? 'Update Service' : 'Add Service')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProviderServices;
