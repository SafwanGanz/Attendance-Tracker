import HomeIcon from '@mui/icons-material/Home';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HistoryIcon from '@mui/icons-material/History';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalculateIcon from '@mui/icons-material/Calculate';

type BottomNavProps = {
  currentTab: 'dashboard' | 'checkin' | 'records' | 'stats' | 'calculator';
  onTabChange: (tab: 'dashboard' | 'checkin' | 'records' | 'stats' | 'calculator') => void;
};

export default function BottomNav({ currentTab, onTabChange }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard' as const, icon: HomeIcon, label: 'Home' },
    { id: 'checkin' as const, icon: CheckCircleIcon, label: 'Check In' },
    { id: 'records' as const, icon: HistoryIcon, label: 'History' },
    { id: 'stats' as const, icon: BarChartIcon, label: 'Stats' },
    { id: 'calculator' as const, icon: CalculateIcon, label: 'Calc' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-blue-600' : 'text-gray-500'
              }`}
            >
              <Icon className={`${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
