import { useState } from 'react';
import CalculateIcon from '@mui/icons-material/Calculate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function AttendanceCalculator() {
  const [currentClasses, setCurrentClasses] = useState('');
  const [attendedClasses, setAttendedClasses] = useState('');
  const [targetPercentage, setTargetPercentage] = useState('75');
  const [result, setResult] = useState<{
    currentPercentage: number;
    classesToAttend: number;
    classesCanMiss: number;
    message: string;
  } | null>(null);

  const calculate = () => {
    const total = parseInt(currentClasses);
    const attended = parseInt(attendedClasses);
    const target = parseInt(targetPercentage);

    if (isNaN(total) || isNaN(attended) || isNaN(target) || total < attended || attended < 0 || total < 0) {
      alert('Please enter valid numbers');
      return;
    }

    const currentPercentage = total > 0 ? (attended / total) * 100 : 0;

    // Calculate classes needed to reach target
    // (attended + x) / (total + x) = target/100
    // attended + x = (target/100) * (total + x)
    // attended + x = (target * total)/100 + (target * x)/100
    // x - (target * x)/100 = (target * total)/100 - attended
    // x(1 - target/100) = (target * total)/100 - attended
    // x = ((target * total)/100 - attended) / (1 - target/100)
    
    let classesToAttend = 0;
    if (currentPercentage < target) {
      classesToAttend = Math.ceil(((target * total / 100) - attended) / (1 - target / 100));
    }

    // Calculate how many classes can be missed while maintaining target
    // (attended) / (total + x) = target/100
    // attended = (target/100) * (total + x)
    // attended = (target * total)/100 + (target * x)/100
    // attended - (target * total)/100 = (target * x)/100
    // x = (attended - (target * total)/100) * (100/target)
    
    let classesCanMiss = 0;
    if (currentPercentage >= target) {
      classesCanMiss = Math.floor((attended - (target * total / 100)) * (100 / target));
    }

    let message = '';
    if (currentPercentage < target) {
      message = `You need to attend ${classesToAttend} more consecutive classes to reach ${target}% attendance.`;
    } else if (currentPercentage === target) {
      message = `You're exactly at ${target}%! Attend all future classes to maintain this.`;
    } else {
      if (classesCanMiss > 0) {
        message = `You can miss up to ${classesCanMiss} classes and still maintain ${target}% attendance.`;
      } else {
        message = `You need to attend all future classes to maintain ${target}% attendance.`;
      }
    }

    setResult({
      currentPercentage: parseFloat(currentPercentage.toFixed(2)),
      classesToAttend,
      classesCanMiss,
      message,
    });
  };

  const reset = () => {
    setCurrentClasses('');
    setAttendedClasses('');
    setTargetPercentage('75');
    setResult(null);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900">Attendance Calculator</h2>

      <div className="rounded-lg shadow-lg p-6" style={{ background: 'linear-gradient(to right, #a855f7, #4f46e5)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalculateIcon fontSize="large" style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            <div>
              <h3 className="text-xl font-bold mb-1" style={{ color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Plan Your Attendance</h3>
              <p className="text-sm font-semibold" style={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>Calculate how many classes you need to attend</p>
            </div>
          </div>
          <a 
            href="https://github.com/SafwanGanz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
            title="GitHub Profile"
          >
            <GitHubIcon fontSize="large" style={{ color: '#ffffff', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Enter Your Details</h3>
        
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Total Classes Held So Far *
          </label>
          <input
            type="number"
            value={currentClasses}
            onChange={(e) => setCurrentClasses(e.target.value)}
            placeholder="e.g., 50"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Classes You Attended *
          </label>
          <input
            type="number"
            value={attendedClasses}
            onChange={(e) => setAttendedClasses(e.target.value)}
            placeholder="e.g., 40"
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Target Attendance Percentage *
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={targetPercentage}
              onChange={(e) => setTargetPercentage(e.target.value)}
              placeholder="75"
              min="0"
              max="100"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <span className="text-gray-700 font-semibold text-lg">%</span>
          </div>
          <p className="text-xs text-gray-600 mt-1 font-medium">Most institutions require 75% attendance</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={calculate}
            className="flex-1 py-4 rounded-lg font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#9333ea', color: '#ffffff' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7e22ce'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#9333ea'}
          >
            <CalculateIcon style={{ color: '#ffffff' }} />
            <span>Calculate</span>
          </button>
          <button
            onClick={reset}
            className="p-4 rounded-lg font-bold transition-all shadow-md hover:shadow-lg"
            style={{ backgroundColor: '#4b5563', color: '#ffffff' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#374151'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4b5563'}
            title="Reset Form"
          >
            <RefreshIcon style={{ color: '#ffffff' }} />
          </button>
        </div>
      </div>

      {result && (
        <div className={`rounded-lg shadow-lg p-6 ${
          result.currentPercentage >= parseInt(targetPercentage) 
            ? 'bg-green-50 border-2 border-green-300' 
            : 'bg-red-50 border-2 border-red-300'
        }`}>
          <div className="flex items-start gap-4 mb-4">
            <div className={`text-5xl ${
              result.currentPercentage >= parseInt(targetPercentage) 
                ? 'text-green-500' 
                : 'text-red-500'
            }`}>
              {result.currentPercentage >= parseInt(targetPercentage) 
                ? <TrendingUpIcon fontSize="inherit" /> 
                : <TrendingDownIcon fontSize="inherit" />
              }
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${
                result.currentPercentage >= parseInt(targetPercentage) 
                  ? 'text-green-800' 
                  : 'text-red-800'
              }`}>
                Current: {result.currentPercentage}%
              </h3>
              <p className={`text-sm ${
                result.currentPercentage >= parseInt(targetPercentage) 
                  ? 'text-green-700' 
                  : 'text-red-700'
              }`}>
                Target: {targetPercentage}%
              </p>
            </div>
          </div>

          <div className={`p-4 rounded-lg ${
            result.currentPercentage >= parseInt(targetPercentage) 
              ? 'bg-green-100 border border-green-300' 
              : 'bg-red-100 border border-red-300'
          }`}>
            <p className={`font-bold text-base ${
              result.currentPercentage >= parseInt(targetPercentage) 
                ? 'text-green-900' 
                : 'text-red-900'
            }`}>
              {result.message}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4">
            {result.currentPercentage < parseInt(targetPercentage) && result.classesToAttend > 0 && (
              <div className="bg-white p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600">Classes Needed</p>
                <p className="text-3xl font-bold text-orange-600">{result.classesToAttend}</p>
                <p className="text-xs text-gray-500 mt-1">consecutive classes to attend</p>
              </div>
            )}
            
            {result.currentPercentage >= parseInt(targetPercentage) && result.classesCanMiss >= 0 && (
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <p className="text-sm text-gray-600">Can Miss</p>
                <p className="text-3xl font-bold text-green-600">{result.classesCanMiss}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {result.classesCanMiss === 0 ? 'classes (attend all!)' : 'more classes'}
                </p>
              </div>
            )}

            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600">Total Classes</p>
              <p className="text-3xl font-bold text-blue-600">{currentClasses}</p>
              <p className="text-xs text-gray-500 mt-1">classes held so far</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600">Attended</p>
              <p className="text-3xl font-bold text-purple-600">{attendedClasses}</p>
              <p className="text-xs text-gray-500 mt-1">classes attended</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-5 shadow-sm">
        <h4 className="font-bold text-blue-900 mb-3 text-base">💡 Tips</h4>
        <ul className="text-sm text-blue-900 space-y-2 font-medium">
          <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span><span>Most colleges require 75% minimum attendance</span></li>
          <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span><span>Medical leaves are usually not counted (check your institution's policy)</span></li>
          <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span><span>Plan ahead to avoid attendance shortage at the end of semester</span></li>
          <li className="flex items-start gap-2"><span className="text-blue-600 font-bold">•</span><span>Regular attendance leads to better understanding and grades</span></li>
        </ul>
      </div>
    </div>
  );
}
