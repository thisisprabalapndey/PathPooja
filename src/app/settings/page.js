
"use client";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, Bell, Shield, Globe, Moon, Sun, Monitor, Volume2, VolumeX,
  Smartphone, Mail, CreditCard, Lock, Key, Eye, EyeOff, User, 
  ArrowRight, Save, RotateCcw, Download, Upload, Trash2, Check,
  AlertCircle, Info, HelpCircle, ExternalLink, RefreshCw, Zap,
  Package // ✅ Added Package import
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../store/user';

export default function SettingsPage() {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState('notifications');
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [theme, setTheme] = useState('system');
  const [sounds, setSounds] = useState(true);
  const [language, setLanguage] = useState('en');
  const [currency, setCurrency] = useState('INR');
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
    offers: true,
    newArrivals: true,
    orderUpdates: true,
    stockAlerts: false,
    priceDrops: true,
    newsletter: true,
    reviews: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'private',
    showEmail: false,
    showPhone: false,
    allowDataCollection: true,
    allowMarketing: false,
    allowAnalytics: true,
    allowCookies: true
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    loginAlerts: true,
    sessionTimeout: '30',
    deviceTracking: true
  });

  const { profile, updateProfile, updatePreferences } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    // Load settings from profile if available
    if (profile?.preferences) {
      setNotifications(prev => ({ ...prev, ...profile.preferences.notifications }));
      setLanguage(profile.preferences.language || 'en');
      setCurrency(profile.preferences.currency || 'INR');
    }
  }, [profile]);

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell, color: 'orange' },
    { id: 'privacy', label: 'Privacy', icon: Shield, color: 'blue' },
    { id: 'security', label: 'Security', icon: Lock, color: 'red' },
    { id: 'appearance', label: 'Appearance', icon: Monitor, color: 'purple' },
    { id: 'preferences', label: 'Preferences', icon: Globe, color: 'green' },
    { id: 'account', label: 'Account', icon: User, color: 'gray' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' }
  ];

  const currencies = [
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' }
  ];

  const saveSettings = () => {
    updatePreferences({
      notifications,
      language,
      currency,
      privacy,
      security,
      theme,
      sounds
    });
    
    // Show success message (you can add a toast notification here)
    alert('Settings saved successfully! 🎉');
  };

  const resetToDefaults = () => {
    setNotifications({
      email: true,
      sms: true,
      push: true,
      offers: true,
      newArrivals: true,
      orderUpdates: true,
      stockAlerts: false,
      priceDrops: true,
      newsletter: true,
      reviews: false
    });
    setPrivacy({
      profileVisibility: 'private',
      showEmail: false,
      showPhone: false,
      allowDataCollection: true,
      allowMarketing: false,
      allowAnalytics: true,
      allowCookies: true
    });
    setSecurity({
      twoFactor: false,
      loginAlerts: true,
      sessionTimeout: '30',
      deviceTracking: true
    });
    setTheme('system');
    setSounds(true);
    setLanguage('en');
    setCurrency('INR');
  };

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Bell size={20} className="text-orange-500" />
          Notification Preferences
        </h3>
        <p className="text-gray-600 mb-6">Choose how you want to be notified about updates and offers.</p>
      </div>

      {/* Notification Categories */}
      <div className="grid gap-6">
        {/* Order Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Package size={18} className="text-blue-500" />
            Order Updates
          </h4>
          <div className="space-y-4">
            {[
              { key: 'orderUpdates', label: 'Order status updates', desc: 'Get notified when your order status changes' },
              { key: 'stockAlerts', label: 'Stock alerts', desc: 'Notify when out-of-stock items are available' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Marketing Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap size={18} className="text-purple-500" />
            Marketing & Offers
          </h4>
          <div className="space-y-4">
            {[
              { key: 'offers', label: 'Special offers & discounts', desc: 'Get notified about sales and promotional offers' },
              { key: 'newArrivals', label: 'New arrivals', desc: 'Be first to know about new spiritual products' },
              { key: 'priceDrops', label: 'Price drops', desc: 'Notify when wishlist items go on sale' },
              { key: 'newsletter', label: 'Weekly newsletter', desc: 'Spiritual insights and product highlights' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Methods */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Delivery Methods</h4>
          <div className="space-y-4">
            {[
              { key: 'email', label: 'Email notifications', icon: Mail },
              { key: 'sms', label: 'SMS notifications', icon: Smartphone },
              { key: 'push', label: 'Push notifications', icon: Bell }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-gray-600" />
                  <p className="font-medium text-gray-900">{label}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key]}
                    onChange={(e) => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={20} className="text-blue-500" />
          Privacy & Data Control
        </h3>
        <p className="text-gray-600 mb-6">Control what information you share and how it's used.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Privacy */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Profile Visibility</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
              <select
                value={privacy.profileVisibility}
                onChange={(e) => setPrivacy(prev => ({ ...prev, profileVisibility: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="private">Private - Only visible to me</option>
                <option value="friends">Friends - Visible to connections</option>
                <option value="public">Public - Visible to everyone</option>
              </select>
            </div>
            
            {[
              { key: 'showEmail', label: 'Show email in profile' },
              { key: 'showPhone', label: 'Show phone number in profile' }
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between">
                <p className="font-medium text-gray-900">{label}</p>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy[key]}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Data Usage */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Data Usage & Analytics</h4>
          <div className="space-y-4">
            {[
              { key: 'allowDataCollection', label: 'Allow data collection', desc: 'Help improve our services with usage data' },
              { key: 'allowMarketing', label: 'Allow marketing analytics', desc: 'Track engagement for personalized offers' },
              { key: 'allowAnalytics', label: 'Allow performance analytics', desc: 'Monitor app performance and reliability' },
              { key: 'allowCookies', label: 'Allow cookies', desc: 'Remember preferences and login status' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{label}</p>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacy[key]}
                    onChange={(e) => setPrivacy(prev => ({ ...prev, [key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Data Download & Deletion */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Data Rights</h4>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all">
              <div className="flex items-center gap-3">
                <Download size={18} className="text-green-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Download my data</p>
                  <p className="text-sm text-gray-600">Get a copy of all your data</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border border-red-300 rounded-xl hover:bg-red-50 transition-all">
              <div className="flex items-center gap-3">
                <Trash2 size={18} className="text-red-600" />
                <div className="text-left">
                  <p className="font-medium text-red-900">Delete my account</p>
                  <p className="text-sm text-red-600">Permanently remove all data</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={20} className="text-red-500" />
          Security & Authentication
        </h3>
        <p className="text-gray-600 mb-6">Keep your account secure with these settings.</p>
      </div>

      <div className="grid gap-6">
        {/* Password & Authentication */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Password & Login</h4>
          <div className="space-y-4">
            <button 
              onClick={() => setShowPasswordChange(true)}
              className="w-full flex items-center justify-between p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all"
            >
              <div className="flex items-center gap-3">
                <Key size={18} className="text-orange-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Change password</p>
                  <p className="text-sm text-gray-600">Last changed 3 months ago</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Two-factor authentication</p>
                <p className="text-sm text-gray-600">Add extra security to your account</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.twoFactor}
                  onChange={(e) => setSecurity(prev => ({ ...prev, twoFactor: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Session Management</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Auto-logout after</label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
                <option value="never">Never</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Login alerts</p>
                <p className="text-sm text-gray-600">Get notified of new login attempts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.loginAlerts}
                  onChange={(e) => setSecurity(prev => ({ ...prev, loginAlerts: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Device tracking</p>
                <p className="text-sm text-gray-600">Track login locations and devices</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={security.deviceTracking}
                  onChange={(e) => setSecurity(prev => ({ ...prev, deviceTracking: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Active Sessions</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">Current Session</p>
                <p className="text-sm text-gray-600">Chrome on macOS • Kanpur, UP</p>
              </div>
              <div className="text-green-600 font-medium">Active</div>
            </div>
            
            <button className="w-full p-4 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-all">
              Sign out from all other devices
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Monitor size={20} className="text-purple-500" />
          Appearance & Display
        </h3>
        <p className="text-gray-600 mb-6">Customize how PoojaPath looks and feels.</p>
      </div>

      <div className="grid gap-6">
        {/* Theme Selection */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Theme</h4>
          <div className="grid grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Light', icon: Sun, preview: 'bg-white border-gray-200' },
              { id: 'dark', label: 'Dark', icon: Moon, preview: 'bg-gray-900 border-gray-700' },
              { id: 'system', label: 'System', icon: Monitor, preview: 'bg-gradient-to-br from-white to-gray-900' }
            ].map(({ id, label, icon: Icon, preview }) => (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  theme === id 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className={`w-full h-16 rounded-lg mb-3 ${preview} border`}></div>
                <div className="flex items-center gap-2 justify-center">
                  <Icon size={16} />
                  <span className="font-medium">{label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Display Options */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Display Options</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Sound effects</p>
                <p className="text-sm text-gray-600">Play sounds for notifications and actions</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={sounds}
                  onChange={(e) => setSounds(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Globe size={20} className="text-green-500" />
          Language & Regional Preferences
        </h3>
        <p className="text-gray-600 mb-6">Set your language, currency, and regional preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Language Selection */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Language</h4>
          <div className="grid gap-3">
            {languages.map(({ code, name, flag }) => (
              <button
                key={code}
                onClick={() => setLanguage(code)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  language === code 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-2xl">{flag}</span>
                <span className="font-medium text-gray-900">{name}</span>
                {language === code && <Check size={16} className="text-green-500 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Currency Selection */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Currency</h4>
          <div className="grid gap-3">
            {currencies.map(({ code, name, symbol }) => (
              <button
                key={code}
                onClick={() => setCurrency(code)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                  currency === code 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="text-xl font-bold text-gray-600">{symbol}</span>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">{name}</p>
                  <p className="text-sm text-gray-600">{code}</p>
                </div>
                {currency === code && <Check size={16} className="text-green-500" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User size={20} className="text-gray-500" />
          Account Management
        </h3>
        <p className="text-gray-600 mb-6">Manage your account settings and data.</p>
      </div>

      <div className="grid gap-6">
        {/* Account Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Account Information</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">Email Address</p>
                <p className="text-sm text-gray-600">{profile?.email}</p>
              </div>
              <button className="text-orange-600 hover:text-orange-700 font-medium">Change</button>
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">Phone Number</p>
                <p className="text-sm text-gray-600">{profile?.phone}</p>
              </div>
              <button className="text-orange-600 hover:text-orange-700 font-medium">Change</button>
            </div>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h4 className="font-bold text-gray-900 mb-4">Subscription</h4>
          <div className="p-4 border border-orange-200 bg-orange-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-bold text-gray-900">Free Account</p>
                <p className="text-sm text-gray-600">Basic features included</p>
              </div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-orange-600 transition-all">
                Upgrade
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white p-6 rounded-2xl border border-red-200">
          <h4 className="font-bold text-red-900 mb-4 flex items-center gap-2">
            <AlertCircle size={18} />
            Danger Zone
          </h4>
          <div className="space-y-4">
            <button className="w-full flex items-center justify-between p-4 border border-red-300 rounded-xl hover:bg-red-50 transition-all">
              <div className="text-left">
                <p className="font-medium text-red-900">Deactivate Account</p>
                <p className="text-sm text-red-600">Temporarily disable your account</p>
              </div>
              <ArrowRight size={16} className="text-red-400" />
            </button>
            
            <button className="w-full flex items-center justify-between p-4 border border-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition-all">
              <div className="text-left">
                <p className="font-bold text-red-900">Delete Account</p>
                <p className="text-sm text-red-600">Permanently remove your account and all data</p>
              </div>
              <ArrowRight size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50/30 via-white to-red-50/30 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-orange-600 transition-colors">🏠 Home</Link>
            <ArrowRight size={16} />
            <Link href="/profile" className="hover:text-orange-600 transition-colors">👤 Profile</Link>
            <ArrowRight size={16} />
            <span className="text-gray-900 font-medium">Settings</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Settings className="text-gray-500" size={32} />
                Settings & Preferences
              </h1>
              <p className="text-gray-600">
                Customize your PoojaPath experience
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={resetToDefaults}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
              >
                <RotateCcw size={16} />
                Reset to Defaults
              </button>
              <button
                onClick={saveSettings}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all"
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-80 flex-shrink-0"
          >
            <div className="bg-white rounded-3xl shadow-lg border border-gray-200 p-6 sticky top-24">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-2xl font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-orange-50 text-orange-600 border-2 border-orange-200'
                          : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <Icon size={20} />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'notifications' && renderNotificationSettings()}
                {activeTab === 'privacy' && renderPrivacySettings()}
                {activeTab === 'security' && renderSecuritySettings()}
                {activeTab === 'appearance' && renderAppearanceSettings()}
                {activeTab === 'preferences' && renderPreferencesSettings()}
                {activeTab === 'account' && renderAccountSettings()}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Password Change Modal */}
        <AnimatePresence>
          {showPasswordChange && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPasswordChange(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-3xl shadow-2xl z-50 p-8 w-full max-w-md"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Change Password</h3>
                  <p className="text-gray-600">Enter your current and new password</p>
                </div>

                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowPasswordChange(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 text-gray-600 rounded-xl hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 px-4 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all font-bold"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

