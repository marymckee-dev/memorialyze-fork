import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, UserCircle, Book, LogOut } from 'lucide-react';
import Button from '../components/ui/Button';
import ProfileEditor from '../components/profile/ProfileEditor';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
  const [showEditor, setShowEditor] = useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8">Profile</h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 bg-primary-500 p-6 md:p-8 text-white">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white text-primary-500 flex items-center justify-center mb-4">
                  <UserCircle size={64} />
                </div>
                <h2 className="text-xl font-semibold mb-1">Sarah Johnson</h2>
                <p className="text-primary-100 mb-4">Family Historian</p>
                <Button variant="outline" size="sm" onClick={() => setShowEditor(true)}>
                  <Settings size={16} />
                  Edit Profile
                </Button>
              </div>
            </div>
            
            <div className="md:w-2/3 p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-4">Account Information</h3>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-neutral-500">Email</p>
                  <p className="font-medium">sarah.johnson@example.com</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Member Since</p>
                  <p className="font-medium">January 15, 2023</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Storage Used</p>
                  <p className="font-medium">1.2GB of 5GB</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Family Group</p>
                  <p className="font-medium">Johnson Family</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button variant="ghost" className="text-neutral-600">
                  <Settings size={18} />
                  Account Settings
                </Button>
                <Button variant="ghost" className="text-neutral-600" onClick={handleSignOut}>
                  <LogOut size={18} />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>

        {showEditor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <ProfileEditor
              onClose={() => setShowEditor(false)}
              onSave={() => window.location.reload()}
            />
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Book className="text-primary-500" size={24} />
              <h2 className="text-xl font-semibold">Your Activity</h2>
            </div>
            
            <div className="space-y-4">
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-medium mb-1">Stories Recorded</h3>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-primary-500">12</p>
                  <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full">
                    +3 this month
                  </span>
                </div>
              </div>
              
              <div className="border-b border-neutral-100 pb-3">
                <h3 className="font-medium mb-1">Family Members Added</h3>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-primary-500">8</p>
                  <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full">
                    +2 this month
                  </span>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Total Recording Time</h3>
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-bold text-primary-500">3h 45m</p>
                  <span className="text-xs bg-primary-50 text-primary-600 px-2 py-1 rounded-full">
                    +45m this month
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Family Group</h2>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Johnson Family</h3>
              <p className="text-neutral-600 text-sm mb-4">
                Manage your family group members and settings
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium text-sm">
                      SJ
                    </div>
                    <div>
                      <p className="font-medium">Sarah Johnson</p>
                      <p className="text-xs text-neutral-500">Admin</p>
                    </div>
                  </div>
                  <span className="text-xs bg-primary-100 text-primary-600 px-2 py-1 rounded-full">
                    You
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary-500 flex items-center justify-center text-white font-medium text-sm">
                      RJ
                    </div>
                    <div>
                      <p className="font-medium">Robert Johnson</p>
                      <p className="text-xs text-neutral-500">Member</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-white font-medium text-sm">
                      EJ
                    </div>
                    <div>
                      <p className="font-medium">Emily Johnson</p>
                      <p className="text-xs text-neutral-500">Member</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button variant="primary" size="sm">
                <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Invite Family Members
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;