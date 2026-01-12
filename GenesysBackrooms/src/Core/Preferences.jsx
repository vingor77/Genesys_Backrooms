import NotLoggedIn from "../Structural/Not_Logged_In";
import { requireSession } from '../Structural/Session_Utils';

export default function Preferences() {
  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  if (!requireSession()) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Preferences</h1>
        <p className="text-gray-400">Customize your experience</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          
          {/* Coming Soon Notice */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold text-white mb-2">Under Construction</h3>
            <p className="text-gray-400">
              Preference settings coming soon! This will include:
            </p>
            <ul className="text-gray-300 mt-4 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Theme customization (dark mode variants)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Notification preferences</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Default dice roller settings</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Display preferences (card layout, list view)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Accessibility options</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Audio/visual effect toggles</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}