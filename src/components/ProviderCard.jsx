import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, RatingStars, Badge } from './ui';

const ProviderCard = ({ provider }) => {
  return (
    <Card hover interactive className="group">
      <div className="p-6">
        {/* Provider Header */}
        <div className="flex items-center space-x-4 mb-4">
          <Avatar
            src={provider.avatar}
            alt={provider.name}
            size="lg"
            className="flex-shrink-0"
          >
            {provider.name?.charAt(0)}
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary-900 truncate group-hover:text-primary-700 transition-colors">
              {provider.name}
            </h3>
            <p className="text-sm text-muted truncate">{provider.service}</p>
          </div>
        </div>

        {/* Rating and Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <RatingStars rating={provider.rating || 4.5} size="sm" />
            <span className="text-sm text-muted">({provider.reviews || 0})</span>
          </div>
          
          <div className="flex items-center text-sm text-muted">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="truncate">{provider.location}</span>
          </div>
          
          <div className="flex items-center text-sm text-muted">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{provider.experience}</span>
          </div>
        </div>

        {/* Skills */}
        {provider.skills && provider.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {provider.skills.slice(0, 2).map((skill, index) => (
                <Badge key={index} variant="secondary" size="sm">
                  {skill}
                </Badge>
              ))}
              {provider.skills.length > 2 && (
                <Badge variant="outline" size="sm">
                  +{provider.skills.length - 2}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-sm font-medium text-primary-600">
            {provider.hourlyRate ? `$${provider.hourlyRate}/hr` : 'Contact for price'}
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/providers/${provider.id}`}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View Profile
            </Link>
            <Link
              to={`/booking?provider=${provider.id}`}
              className="text-sm bg-primary-600 text-white px-3 py-1 rounded-md hover:bg-primary-700 transition-colors"
            >
              Book
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProviderCard;