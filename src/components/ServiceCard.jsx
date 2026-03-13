import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Badge } from './ui';

const ServiceCard = ({ service }) => {
  return (
    <Card hover interactive className="group">
      <div className="p-6">
        {/* Service Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 text-xl">
            {service.icon || '🔧'}
          </div>
          <Badge variant={service.featured ? 'primary' : 'secondary'} size="sm">
            {service.featured ? 'Featured' : 'Popular'}
          </Badge>
        </div>

        {/* Service Info */}
        <h3 className="font-semibold text-primary-900 mb-2 group-hover:text-primary-700 transition-colors">
          {service.name}
        </h3>
        <p className="text-sm text-muted mb-4 line-clamp-2">
          {service.description || 'Professional service with quality workmanship and customer satisfaction guaranteed.'}
        </p>

        {/* Service Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>{service.price ? `Starting at $${service.price}` : 'Contact for pricing'}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>{service.providers || 50} providers available</span>
          </div>
          
          <div className="flex items-center text-sm text-muted">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{service.duration || '1-2 hours'}</span>
          </div>
        </div>

        {/* Categories */}
        {service.categories && service.categories.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {service.categories.slice(0, 2).map((category, index) => (
                <Badge key={index} variant="outline" size="sm">
                  {category}
                </Badge>
              ))}
              {service.categories.length > 2 && (
                <Badge variant="outline" size="sm">
                  +{service.categories.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="flex text-accent-600">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < (service.rating || 4) ? 'fill-current' : 'text-gray-300'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-sm text-muted">({service.reviews || 0})</span>
          </div>
          <Link
            to={`/services/${service.id}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            View Details →
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default ServiceCard;