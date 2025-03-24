import React from 'react';
import { AlertCircle, CheckCircle, Heart, Brain, Shield, Lightbulb, Clock } from 'lucide-react';

interface AnalysisResultProps {
  analysis: string | null;
  isLoading: boolean;
  error?: string;
  isVideo?: boolean;
}

export function AnalysisResult({ analysis, isLoading, error, isVideo }: AnalysisResultProps) {
  if (isLoading) {
    return (
      <div className="mt-6 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">
            Analyzing your pet's {isVideo ? 'video' : 'photo'}...
            {isVideo && ' This may take a few moments.'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-lg bg-red-50 p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  // Split analysis into sections based on newlines and keywords
  const sections = analysis.split(/\n\n+/).filter(Boolean);

  return (
    <div className="mt-6 space-y-6">
      {isVideo && (
        <div className="rounded-lg bg-blue-50 border border-blue-100 p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-blue-500" />
            <p className="text-blue-700">
              Video analysis provides insights about your pet's behavior over time,
              including movement patterns and changes in emotional state.
            </p>
          </div>
        </div>
      )}
      
      {sections.map((section, index) => {
        const isEmotional = /emotional|mood|feeling|stress|anxiety/i.test(section);
        const isHealth = /health|physical|condition|weight/i.test(section);
        const isEnvironment = /environment|surroundings|hazard/i.test(section);
        const isRecommendation = /recommend|suggest|try|consider/i.test(section);
        const isBehavior = /behavior|movement|activity|interaction/i.test(section);

        let icon = <CheckCircle className="h-6 w-6 text-green-500" />;
        let bgColor = "bg-green-50";
        let borderColor = "border-green-100";

        if (isEmotional) {
          icon = <Heart className="h-6 w-6 text-pink-500" />;
          bgColor = "bg-pink-50";
          borderColor = "border-pink-100";
        } else if (isHealth) {
          icon = <Shield className="h-6 w-6 text-blue-500" />;
          bgColor = "bg-blue-50";
          borderColor = "border-blue-100";
        } else if (isEnvironment) {
          icon = <Brain className="h-6 w-6 text-purple-500" />;
          bgColor = "bg-purple-50";
          borderColor = "border-purple-100";
        } else if (isRecommendation) {
          icon = <Lightbulb className="h-6 w-6 text-yellow-500" />;
          bgColor = "bg-yellow-50";
          borderColor = "border-yellow-100";
        } else if (isBehavior && isVideo) {
          icon = <Clock className="h-6 w-6 text-indigo-500" />;
          bgColor = "bg-indigo-50";
          borderColor = "border-indigo-100";
        }

        return (
          <div
            key={index}
            className={`rounded-lg ${bgColor} border ${borderColor} p-6 shadow-sm transition-all hover:shadow-md`}
          >
            <div className="flex items-start space-x-3">
              {icon}
              <div className="flex-1">
                <div className="whitespace-pre-wrap text-gray-700">{section}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}