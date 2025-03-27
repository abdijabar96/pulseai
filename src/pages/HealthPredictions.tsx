import React, { useState } from 'react';
import { Activity, ArrowLeft, ArrowRight, Upload, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { analyzePetHealth } from '../lib/gemini';

interface HealthFormData {
  // Basic Information
  name: string;
  species: string;
  breed: string;
  age_years: number;
  age_months: number;
  gender: string;
  photo_url?: string;

  // Weight and Body Condition
  weight: number;
  weight_unit: 'kg' | 'lbs';
  weight_changed: boolean;
  body_condition: string;

  // Activity
  activity_duration: number;
  activity_types: string[];
  activity_changed: boolean;

  // Diet
  food_type: string;
  meals_per_day: number;
  portion_size: string;
  food_allergies: string[];
  treats_per_day: number;

  // Health History
  chronic_conditions: string[];
  medications: boolean;
  surgery_history: boolean;
  last_checkup: string;

  // Behavior
  unusual_behaviors: string[];
  behavioral_issues: string[];
  energy_level: string;

  // Environment
  environment: string;
  water_access: boolean;
  hazards: string[];

  // Preventive Care
  vaccinated: boolean;
  preventive_care: boolean;
  last_dental: string;
}

const initialFormData: HealthFormData = {
  name: '',
  species: '',
  breed: '',
  age_years: 0,
  age_months: 0,
  gender: '',
  weight: 0,
  weight_unit: 'kg',
  weight_changed: false,
  body_condition: '',
  activity_duration: 0,
  activity_types: [],
  activity_changed: false,
  food_type: '',
  meals_per_day: 2,
  portion_size: '',
  food_allergies: [],
  treats_per_day: 0,
  chronic_conditions: [],
  medications: false,
  surgery_history: false,
  last_checkup: '',
  unusual_behaviors: [],
  behavioral_issues: [],
  energy_level: '',
  environment: '',
  water_access: true,
  hazards: [],
  vaccinated: false,
  preventive_care: false,
  last_dental: ''
};

const formSections = [
  {
    title: 'Basic Information',
    fields: ['name', 'species', 'breed', 'age_years', 'age_months', 'gender', 'photo']
  },
  {
    title: 'Weight and Body Condition',
    fields: ['weight', 'weight_unit', 'weight_changed', 'body_condition']
  },
  {
    title: 'Activity Levels',
    fields: ['activity_duration', 'activity_types', 'activity_changed']
  },
  {
    title: 'Diet and Nutrition',
    fields: ['food_type', 'meals_per_day', 'portion_size', 'food_allergies', 'treats_per_day']
  },
  {
    title: 'Health History',
    fields: ['chronic_conditions', 'medications', 'surgery_history', 'last_checkup']
  },
  {
    title: 'Behavioral Observations',
    fields: ['unusual_behaviors', 'behavioral_issues', 'energy_level']
  },
  {
    title: 'Environmental Factors',
    fields: ['environment', 'water_access', 'hazards']
  },
  {
    title: 'Vaccination and Preventive Care',
    fields: ['vaccinated', 'preventive_care', 'last_dental']
  }
];

export default function HealthPredictions() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<HealthFormData>(initialFormData);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [prediction, setPrediction] = useState<string>();
  const navigate = useNavigate();

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
    }
  };

  const handleInputChange = (field: keyof HealthFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(undefined);

      // Upload photo if selected
      let photoUrl;
      if (photoFile) {
        const { data, error: uploadError } = await supabase.storage
          .from('pet-photos')
          .upload(`${Date.now()}-${photoFile.name}`, photoFile);

        if (uploadError) throw uploadError;
        photoUrl = data.path;
      }

      // Create pet record
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .insert({
          name: formData.name,
          species: formData.species,
          breed: formData.breed,
          birth_date: new Date(Date.now() - ((formData.age_years * 12 + formData.age_months) * 30.44 * 24 * 60 * 60 * 1000)),
          gender: formData.gender,
          photo_url: photoUrl
        })
        .select()
        .single();

      if (petError) throw petError;

      // Create health record
      const { data: healthData, error: healthError } = await supabase
        .from('health_records')
        .insert({
          pet_id: petData.id,
          weight: formData.weight,
          weight_unit: formData.weight_unit,
          body_condition: formData.body_condition,
          activity_duration: formData.activity_duration,
          activity_types: formData.activity_types,
          food_type: formData.food_type,
          meals_per_day: formData.meals_per_day,
          portion_size: formData.portion_size,
          food_allergies: formData.food_allergies,
          treats_per_day: formData.treats_per_day,
          chronic_conditions: formData.chronic_conditions,
          medications: formData.medications,
          surgery_history: formData.surgery_history,
          last_checkup: formData.last_checkup,
          unusual_behaviors: formData.unusual_behaviors,
          behavioral_issues: formData.behavioral_issues,
          energy_level: formData.energy_level,
          environment: formData.environment,
          water_access: formData.water_access,
          hazards: formData.hazards,
          vaccinated: formData.vaccinated,
          preventive_care: formData.preventive_care,
          last_dental: formData.last_dental
        })
        .select()
        .single();

      if (healthError) throw healthError;

      // Generate AI prediction
      const analysis = await analyzePetHealth(formData);

      // Save prediction
      const { error: predictionError } = await supabase
        .from('health_predictions')
        .insert({
          health_record_id: healthData.id,
          prediction_text: analysis.prediction,
          risk_factors: analysis.risks,
          recommendations: analysis.recommendations,
          severity: analysis.severity
        });

      if (predictionError) throw predictionError;

      setPrediction(analysis.prediction);
    } catch (err) {
      console.error('Error submitting health data:', err);
      setError('Failed to submit health data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentSection = () => {
    const section = formSections[currentSection];

    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>

        {section.fields.map(field => {
          switch (field) {
            case 'photo':
              return (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Pet Photo
                  </label>
                  <div className="flex items-center space-x-4">
                    {photoFile ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(photoFile)}
                          alt="Pet preview"
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                        <button
                          onClick={() => setPhotoFile(null)}
                          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-400">
                        <Upload className="h-8 w-8 text-gray-400" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handlePhotoSelect}
                        />
                      </label>
                    )}
                  </div>
                </div>
              );

            case 'weight':
            case 'age_years':
            case 'age_months':
            case 'activity_duration':
            case 'meals_per_day':
            case 'treats_per_day':
              return (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  <input
                    type="number"
                    value={formData[field as keyof HealthFormData]}
                    onChange={(e) => handleInputChange(field as keyof HealthFormData, parseInt(e.target.value))}
                    min="0"
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              );

            case 'name':
            case 'species':
            case 'breed':
            case 'gender':
            case 'food_type':
            case 'portion_size':
            case 'energy_level':
            case 'environment':
              return (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  <input
                    type="text"
                    value={formData[field as keyof HealthFormData]}
                    onChange={(e) => handleInputChange(field as keyof HealthFormData, e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              );

            case 'weight_unit':
              return (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Weight Unit
                  </label>
                  <select
                    value={formData.weight_unit}
                    onChange={(e) => handleInputChange('weight_unit', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="kg">Kilograms (kg)</option>
                    <option value="lbs">Pounds (lbs)</option>
                  </select>
                </div>
              );

            case 'body_condition':
              return (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Body Condition
                  </label>
                  <select
                    value={formData.body_condition}
                    onChange={(e) => handleInputChange('body_condition', e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select condition</option>
                    <option value="underweight">Underweight</option>
                    <option value="ideal">Ideal</option>
                    <option value="overweight">Overweight</option>
                    <option value="obese">Obese</option>
                  </select>
                </div>
              );

            case 'activity_types':
            case 'food_allergies':
            case 'chronic_conditions':
            case 'unusual_behaviors':
            case 'behavioral_issues':
            case 'hazards':
              return (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  <input
                    type="text"
                    placeholder="Enter values separated by commas"
                    value={(formData[field as keyof HealthFormData] as string[]).join(', ')}
                    onChange={(e) => handleInputChange(field as keyof HealthFormData, e.target.value.split(',').map(s => s.trim()))}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              );

            case 'weight_changed':
            case 'activity_changed':
            case 'medications':
            case 'surgery_history':
            case 'water_access':
            case 'vaccinated':
            case 'preventive_care':
              return (
                <div key={field} className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData[field as keyof HealthFormData] as boolean}
                      onChange={(e) => handleInputChange(field as keyof HealthFormData, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </label>
                </div>
              );

            case 'last_checkup':
            case 'last_dental':
              return (
                <div key={field} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </label>
                  <input
                    type="date"
                    value={formData[field as keyof HealthFormData]}
                    onChange={(e) => handleInputChange(field as keyof HealthFormData, e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  if (prediction) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-green-50 p-6">
          <h2 className="text-xl font-semibold text-green-900">Health Analysis Complete</h2>
          <div className="mt-4 whitespace-pre-wrap text-green-800">{prediction}</div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="w-full rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-blue-100 p-2">
          <Activity className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Health Assessment</h1>
          <p className="mt-2 text-gray-600">
            Complete this questionnaire to receive AI-powered health insights and recommendations.
          </p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        {renderCurrentSection()}

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentSection(prev => prev - 1)}
            disabled={currentSection === 0}
            className="flex items-center space-x-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Previous</span>
          </button>

          {currentSection === formSections.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Activity className="h-5 w-5" />
                  <span>Get Health Insights</span>
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(prev => prev + 1)}
              className="flex items-center space-x-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              <span>Next</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4">
          <div className="flex items-center text-red-800">
            <AlertTriangle className="mr-2 h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-yellow-50 p-4">
        <div className="flex items-start space-x-2 text-yellow-800">
          <AlertTriangle className="mt-1 h-5 w-5 flex-shrink-0" />
          <div>
            <p className="font-medium">Important Note</p>
            <p className="mt-1 text-sm">
              This health assessment is for informational purposes only and does not
              replace professional veterinary care. Always consult with your
              veterinarian for proper diagnosis and treatment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}