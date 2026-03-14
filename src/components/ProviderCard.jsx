import React from "react";
import { Link } from "react-router-dom";
import { Card, Avatar, RatingStars, Badge } from "./ui";

const ProviderCard = ({ provider }) => {
  console.log(provider);
  return (
    <Card
      hover
      interactive
      className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl"
    >
      {/* Animated hover gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-primary-50 via-transparent to-primary-50 pointer-events-none" />

      <div className="relative p-6 flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center gap-4 mb-5">

          <div className="relative">
            <Avatar
              src={provider.avatar}
              alt={provider.user?.name}
              size="lg"
              className="ring-2 ring-gray-100 transition-all duration-300 group-hover:ring-primary-400 group-hover:scale-110"
            >
              {provider.user?.name?.charAt(0)}
            </Avatar>

            {/* Online indicator */}
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="flex-1 min-w-0">

            <h3 className="text-lg font-semibold text-primary-900 truncate transition group-hover:text-primary-700">
              {provider.user?.name}
            </h3>

            <p className="text-sm text-muted truncate">
              {provider.services?.[0]?.service?.name || 'Service Provider'}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 mt-1">
              <RatingStars rating={provider.rating || 4.5} size="sm" />

              <span className="text-xs text-muted">
                ({provider.reviewCount || 0})
              </span>
            </div>

          </div>

        </div>

        {/* Info */}
        <div className="space-y-2 text-sm text-muted mb-5">

          <div className="flex items-center gap-2 group-hover:text-gray-700 transition">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 transition group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>

            <span className="truncate">{provider.location}</span>
          </div>

          <div className="flex items-center gap-2 group-hover:text-gray-700 transition">
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0 transition group-hover:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>

            <span>{provider.experience}</span>
          </div>

        </div>

        {/* Skills */}
        {provider.skills && provider.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {provider.skills.slice(0, 2).map((skill, index) => (
              <Badge
                key={index}
                variant="secondary"
                size="sm"
                className="bg-primary-50 text-primary-700 border border-primary-100 transition transform group-hover:-translate-y-1 group-hover:shadow-sm"
              >
                {skill}
              </Badge>
            ))}

            {provider.skills.length > 2 && (
              <Badge
                variant="outline"
                size="sm"
                className="transition group-hover:border-primary-300"
              >
                +{provider.skills.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">

          {/* Price */}
          <div className="text-right">
            {provider.services?.[0]?.price && (
              <div className="text-lg font-semibold text-primary-600">
                ${provider.services[0].price}
                <span className="text-xs text-muted font-normal">/hr</span>
              </div>
            )}
          </div>

          {/* Book Button */}
          <Link
            to={`/booking?provider=${provider.id}`}
            className="relative bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-primary-700 hover:scale-105 hover:shadow-lg"
          >
            Book Now
          </Link>

        </div>

      </div>
    </Card>
  );
};

export default ProviderCard;