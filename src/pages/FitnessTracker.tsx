import React, { useState } from 'react';
import { Activity, Calendar, TrendingUp, Clock, Award } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

interface Activity {
  id: string;
  type: 'walk' | 'play' | 'training';
  duration: number;
  date: Date;
}

interface Goal {
  type: 'walk' | 'play' | 'training';
  duration: number;
}

export default function FitnessTracker() {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: '1',
      type: 'walk',
      duration: 30,
      date: subDays(new Date(), 6)
    },
    {
      id: '2',
      type: 'play',
      duration: 15,
      date: subDays(new Date(), 5)
    },
    {
      id: '3',
      type: 'training',
      duration: 20,
      date: subDays(new Date(), 4)
    },
    {
      id: '4',
      type: 'walk',
      duration: 45,
      date: subDays(new Date(), 3)
    },
    {
      id: '5',
      type: 'play',
      duration: 25,
      date: subDays(new Date(), 2)
    },
    {
      id: '6',
      type: 'walk',
      duration: 35,
      date: subDays(new Date(), 1)
    },
    {
      id: '7',
      type: 'training',
      duration: 15,
      date: new Date()
    }
  ]);

  const [goals] = useState<Goal[]>([
    { type: 'walk', duration: 30 },
    { type: 'play', duration: 20 },
    { type: 'training', duration: 15 }
  ]);

  const [newActivity, setNewActivity] = useState({
    type: 'walk' as Activity['type'],
    duration: 30
  });

  const addActivity = () => {
    const activity: Activity = {
      id: Date.now().toString(),
      ...newActivity,
      date: new Date()
    };

    setActivities([...activities, activity]);
    setNewActivity({ type: 'walk', duration: 30 });
  };

  const chartData = activities.map(activity => ({
    date: format(activity.date, 'MMM d'),
    duration: activity.duration
  }));

  const getTotalDuration = (type: Activity['type']) => {
    return activities
      .filter(a => a.type === type)
      .reduce((sum, a) => sum + a.duration, 0);
  };

  const getGoalProgress = (type: Activity['type']) => {
    const goal = goals.find(g => g.type === type);
    if (!goal) return 0;
    
    const today = activities
      .filter(a => a.type === type && format(a.date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd'))
      .reduce((sum, a) => sum + a.duration, 0);
    
    return Math.min((today / goal.duration) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start space-x-3">
        <div className="rounded-full bg-indigo-100 p-2">
          <Activity className="h-6 w-6 text-indigo-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pet Fitness Tracker</h1>
          <p className="mt-2 text-gray-600">
            Track your pet's daily activities and monitor their fitness progress.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center space-x-2 text-indigo-600">
            <Calendar className="h-5 w-5" />
            <h2 className="font-semibold">Today's Goals</h2>
          </div>
          
          <div className="space-y-4">
            {goals.map(goal => (
              <div key={goal.type} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="capitalize">{goal.type}</span>
                  <span>{Math.round(getGoalProgress(goal.type))}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${getGoalProgress(goal.type)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center space-x-2 text-indigo-600">
            <TrendingUp className="h-5 w-5" />
            <h2 className="font-semibold">Weekly Stats</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Total Walk Time</span>
              <span className="font-semibold">{getTotalDuration('walk')} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Play Time</span>
              <span className="font-semibold">{getTotalDuration('play')} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Total Training Time</span>
              <span className="font-semibold">{getTotalDuration('training')} min</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center space-x-2 text-indigo-600">
            <Award className="h-5 w-5" />
            <h2 className="font-semibold">Add Activity</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Activity Type
              </label>
              <select
                value={newActivity.type}
                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value as Activity['type'] })}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="walk">Walk</option>
                <option value="play">Play</option>
                <option value="training">Training</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={newActivity.duration}
                onChange={(e) => setNewActivity({ ...newActivity, duration: parseInt(e.target.value) })}
                min="1"
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            
            <button
              onClick={addActivity}
              className="w-full rounded-lg bg-indigo-500 px-4 py-2 text-white transition-colors hover:bg-indigo-600"
            >
              Add Activity
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center space-x-2 text-indigo-600">
          <Clock className="h-5 w-5" />
          <h2 className="font-semibold">Activity History</h2>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="duration"
                stroke="#6366f1"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}