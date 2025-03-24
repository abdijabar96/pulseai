import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, MapPin } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Welcome to Pet Care Hub</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Link
          to="/analysis"
          className="group rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white">
            <Camera className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Pet Analysis</h2>
          <p className="text-gray-600">
            Upload a photo of your pet for AI-powered health analysis and recommendations
          </p>
        </Link>

        <Link
          to="/services"
          className="group rounded-lg bg-white p-6 shadow-lg transition-all hover:shadow-xl"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white">
            <MapPin className="h-6 w-6" />
          </div>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Pet Services</h2>
          <p className="text-gray-600">
            Find nearby veterinarians, groomers, and pet-friendly parks
          </p>
        </Link>
      </div>
    </div>
  );
}