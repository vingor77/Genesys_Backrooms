import NotLoggedIn from "../Structural/Not_Logged_In";
import { requireSession, isDM } from '../Structural/Session_Utils';

export default function ProfileSettings() {
  const userIsDM = isDM();
  const username = localStorage.getItem('loggedIn') || 'User';

  if (localStorage.getItem("loggedIn") === 'false') {
    return <NotLoggedIn />;
  }

  if (!requireSession()) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          
          {/* User Info Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
            
            <div className="space-y-4">
              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Username</div>
                <div className="text-xl font-bold text-white">{username}</div>
              </div>

              <div className="bg-black/30 rounded-lg p-4 border border-white/10">
                <div className="text-sm text-gray-400 mb-1">Account Type</div>
                <div className="flex items-center space-x-2">
                  {userIsDM ? (
                    <>
                      <span className="text-xl font-bold text-purple-400">Game Master</span>
                      <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded border border-purple-500/50 font-bold">
                        DM
                      </span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-blue-400">Player</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg p-6 border border-purple-500/30 text-center">
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold text-white mb-2">Under Construction</h3>
            <p className="text-gray-400">
              Profile settings features coming soon! This will include:
            </p>
            <ul className="text-gray-300 mt-4 space-y-2 text-left max-w-md mx-auto">
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Change username</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Update email</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Change password</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Account security settings</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-purple-400">•</span>
                <span>Delete account</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}