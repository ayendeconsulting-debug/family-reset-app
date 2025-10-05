import React, { useState } from 'react';
import { Heart, Send, EyeOff, Users, Pause, CheckCircle, Target, Lightbulb, Shield, Map, UserPlus, Copy, Mail, LogIn, User, Settings, Sparkles, X, Save } from 'lucide-react';

export default function BlendedFamilyResetApp() {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showJoinFamily, setShowJoinFamily] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [userName, setUserName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('FAMILY2025');
  
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    role: '',
    ambitions: '',
    dreams: '',
    interests: '',
    bio: ''
  });

  const [familyMembers, setFamilyMembers] = useState([
    { name: 'You', role: 'Organizer', status: 'Active' }
  ]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [activeTab, setActiveTab] = useState('anonymous');
  const [anonymousText, setAnonymousText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submissions, setSubmissions] = useState([
    { id: 1, text: 'I feel like I do not belong here', votes: 3 },
    { id: 2, text: 'I want us to have our own traditions', votes: 5 },
    { id: 3, text: 'I miss how things used to be', votes: 4 }
  ]);
  const [selectedGroundRules, setSelectedGroundRules] = useState([]);
  const [hopes, setHopes] = useState([
    { id: 1, text: 'Weekly family dinners together', author: 'Anonymous' },
    { id: 2, text: 'Feel comfortable being myself', author: 'Sarah' }
  ]);
  const [peaceTalkMode, setPeaceTalkMode] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [agreements, setAgreements] = useState([]);
  const [currentCard, setCurrentCard] = useState(0);

  const groundRulesOptions = [
    'No interrupting when someone is speaking',
    'No bringing up past arguments',
    'Take breaks when emotions run high',
    'Focus on solutions, not blame',
    'Everyone gets equal time to talk',
    'No phones or distractions',
    'Listen to understand, not to respond',
    'Speak from I feel not You always',
    'One topic at a time',
    'End on a positive note'
  ];

  const conversationCards = [
    { category: 'Understanding', question: 'What is one thing you wish the family understood about you?', gradient: 'from-yellow-400 to-amber-500' },
    { category: 'Hope', question: 'One year from now, what would make you glad we had this talk?', gradient: 'from-amber-400 to-yellow-500' },
    { category: 'Loss', question: 'What is something you miss from before our family changed?', gradient: 'from-yellow-500 to-amber-600' },
    { category: 'Need', question: 'What would help you feel more at home here?', gradient: 'from-amber-500 to-yellow-400' },
    { category: 'Future', question: 'What small change would make the biggest difference for you?', gradient: 'from-yellow-400 to-amber-400' },
    { category: 'Safety', question: 'When do you feel most comfortable in our family?', gradient: 'from-amber-400 to-yellow-600' }
  ];

  const handleCreateFamily = () => {
    if (familyName.trim() && userName.trim()) {
      setIsRegistered(true);
      setIsOrganizer(true);
      setShowCreateFamily(false);
      setUserProfile({ ...userProfile, name: userName, role: 'Organizer' });
      setGeneratedCode('FAM' + Math.random().toString(36).substring(2, 8).toUpperCase());
    }
  };

  const handleJoinFamily = () => {
    if (joinCode.trim() && userName.trim()) {
      setIsRegistered(true);
      setIsOrganizer(false);
      setShowJoinFamily(false);
      setUserProfile({ ...userProfile, name: userName, role: 'Family Member' });
    }
  };

  const handleSaveProfile = () => {
    setShowSettings(false);
    alert('Profile saved successfully');
  };

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]"></div>
        <div className="max-w-md w-full relative z-10">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 mb-6 border border-yellow-500/20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Heart className="text-yellow-500" size={48} fill="currentColor" />
                <Sparkles className="absolute -top-1 -right-1 text-amber-400" size={20} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Family Reset</h1>
            </div>
            <p className="text-center text-gray-300 mb-8">A sacred space for blended families to heal and reconnect</p>

            {!showCreateFamily && !showJoinFamily && (
              <div className="space-y-4">
                <button onClick={() => setShowCreateFamily(true)} className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-4 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 flex items-center justify-center gap-2 text-lg font-bold shadow-lg shadow-yellow-500/20">
                  <UserPlus size={24} />
                  Create Family Space
                </button>
                <button onClick={() => setShowJoinFamily(true)} className="w-full border-2 border-yellow-500 text-yellow-400 py-4 rounded-xl hover:bg-yellow-500/10 transition-all duration-300 flex items-center justify-center gap-2 text-lg font-bold">
                  <LogIn size={24} />
                  Join Existing Family
                </button>
              </div>
            )}

            {showCreateFamily && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Your Name or Nickname</label>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="What should we call you?" className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Family Space Name</label>
                  <input type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Our Family, The Smiths, etc." className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                  <p className="text-sm text-yellow-200">You will get a join code to invite family members. They can join whenever they are ready.</p>
                </div>
                <button onClick={handleCreateFamily} className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-3 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 font-bold">Create Space</button>
                <button onClick={() => setShowCreateFamily(false)} className="w-full border-2 border-gray-700 text-gray-300 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300">Back</button>
              </div>
            )}

            {showJoinFamily && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Your Name or Nickname</label>
                  <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="What should we call you?" className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Join Code</label>
                  <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.toUpperCase())} placeholder="Enter the code from your family" className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors uppercase font-mono tracking-wider" />
                </div>
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
                  <p className="text-sm text-amber-200">Join when you are ready. You can start as an observer and participate when comfortable.</p>
                </div>
                <button onClick={handleJoinFamily} className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-3 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 font-bold">Join Family Space</button>
                <button onClick={() => setShowJoinFamily(false)} className="w-full border-2 border-gray-700 text-gray-300 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300">Back</button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-yellow-500/20">
            <h3 className="font-bold text-yellow-400 mb-3 text-lg">How It Works</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black font-bold text-xs">1</span>
                </div>
                <p>One person creates a family space and gets a join code</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black font-bold text-xs">2</span>
                </div>
                <p>Family members join voluntarily using the code</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black font-bold text-xs">3</span>
                </div>
                <p>Everyone participates at their own pace and comfort level</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-black font-bold text-xs">4</span>
                </div>
                <p>Prepare together for a peace talk when ready</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.05),transparent_50%)]"></div>
      <div className="max-w-4xl mx-auto p-4 relative z-10">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-6 border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="text-yellow-500" size={32} fill="currentColor" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">{familyName || 'Our Family'} Reset Journey</h1>
                <p className="text-gray-400">Building our new beginning together</p>
              </div>
            </div>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
              <Settings className="text-yellow-500" size={24} />
            </button>
          </div>
        </div>

        {showSettings && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-yellow-500/20">
              <div className="sticky top-0 bg-gradient-to-br from-gray-800 to-gray-900 p-6 border-b border-gray-700 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-yellow-400">Profile Settings</h2>
                <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                  <X className="text-gray-400" size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                    <User className="text-black" size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{userProfile.name || userName}</h3>
                    <p className="text-gray-400">{userProfile.role}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Display Name</label>
                  <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({...userProfile, name: e.target.value})} placeholder="Your name" className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Age</label>
                  <input type="text" value={userProfile.age} onChange={(e) => setUserProfile({...userProfile, age: e.target.value})} placeholder="Your age (optional)" className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Bio</label>
                  <textarea value={userProfile.bio} onChange={(e) => setUserProfile({...userProfile, bio: e.target.value})} placeholder="Tell your family about yourself..." className="w-full h-24 p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl resize-none focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Ambitions</label>
                  <textarea value={userProfile.ambitions} onChange={(e) => setUserProfile({...userProfile, ambitions: e.target.value})} placeholder="What are your goals and aspirations?" className="w-full h-24 p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl resize-none focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Dreams</label>
                  <textarea value={userProfile.dreams} onChange={(e) => setUserProfile({...userProfile, dreams: e.target.value})} placeholder="What do you dream about for your future?" className="w-full h-24 p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl resize-none focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-2">Interests</label>
                  <textarea value={userProfile.interests} onChange={(e) => setUserProfile({...userProfile, interests: e.target.value})} placeholder="What do you enjoy doing? Hobbies, activities, passions..." className="w-full h-24 p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl resize-none focus:outline-none focus:border-yellow-500 transition-colors" />
                </div>

                <div className="flex gap-3 pt-4">
                  <button onClick={handleSaveProfile} className="flex-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-3 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 font-bold flex items-center justify-center gap-2">
                    <Save size={20} />
                    Save Profile
                  </button>
                  <button onClick={() => setShowSettings(false)} className="flex-1 border-2 border-gray-700 text-gray-300 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isOrganizer && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-yellow-400">Family Members</h2>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(generatedCode)} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm border border-yellow-500/30">
                  <Copy size={16} />
                  {generatedCode}
                </button>
                <button onClick={() => {
                  const email = prompt('Enter email or phone:');
                  if (email) setPendingInvites([...pendingInvites, { id: Date.now(), contact: email, sent: 'Just now' }]);
                }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 text-sm font-bold">
                  <Mail size={16} />
                  Invite
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              {familyMembers.map((member, i) => (
                <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-3 flex items-center gap-3 hover:border-yellow-500/30 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center">
                    <User className="text-black" size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role} - {member.status}</p>
                  </div>
                </div>
              ))}
            </div>

            {pendingInvites.length > 0 && (
              <div className="border-t border-gray-700 pt-4">
                <p className="text-sm font-medium text-yellow-400 mb-2">Pending Invitations</p>
                {pendingInvites.map(inv => (
                  <div key={inv.id} className="text-sm text-gray-400 flex justify-between">
                    <span>{inv.contact}</span>
                    <span className="text-gray-600">{inv.sent}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
              <p className="text-xs text-yellow-200">Share the join code with family members. They can join when ready.</p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 mb-6 border border-yellow-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-400">Reset Progress</span>
            <span className="text-sm text-gray-400">Phase 1 of 3</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 h-2 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-700 rounded-full"></div>
            <div className="flex-1 h-2 bg-gray-700 rounded-full"></div>
          </div>
          <div className="mt-2 text-xs text-gray-400 flex justify-between">
            <span>Preparation</span>
            <span>Peace Talk</span>
            <span>Follow Through</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-2 mb-6 grid grid-cols-2 md:grid-cols-4 gap-2 border border-yellow-500/20">
          <button onClick={() => setActiveTab('anonymous')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-sm ${activeTab === 'anonymous' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>
            <EyeOff size={16} />
            <span>Safe Share</span>
          </button>
          <button onClick={() => setActiveTab('rules')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-sm ${activeTab === 'rules' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>
            <Shield size={16} />
            <span>Ground Rules</span>
          </button>
          <button onClick={() => setActiveTab('hopes')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-sm ${activeTab === 'hopes' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>
            <Lightbulb size={16} />
            <span>Hopes</span>
          </button>
          <button onClick={() => setActiveTab('peacetalk')} className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl transition-all duration-300 text-sm ${activeTab === 'peacetalk' ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold' : 'text-gray-400 hover:bg-gray-700'}`}>
            <Users size={16} />
            <span>Peace Talk</span>
          </button>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 border border-yellow-500/20">
          {activeTab === 'anonymous' && (
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Safe Sharing Space</h2>
              <p className="text-gray-300 mb-6">Share what matters to you. Others will see these but will not know who wrote them unless you choose to add your name.</p>
              
              <div className="mb-6">
                <textarea value={anonymousText} onChange={(e) => setAnonymousText(e.target.value)} placeholder="What do you want the family to know?" className="w-full h-32 p-4 bg-gray-900 border-2 border-gray-700 text-white rounded-xl resize-none focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500" />
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="rounded accent-yellow-500" />
                    Keep anonymous
                  </label>
                  <button onClick={() => {
                    if (anonymousText.trim()) {
                      setSubmissions([{ id: Date.now(), text: anonymousText, votes: 0 }, ...submissions]);
                      setAnonymousText('');
                    }
                  }} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-6 py-2 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 flex items-center gap-2 font-bold">
                    <Send size={18} />
                    Submit
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-6">
                <h3 className="font-bold text-yellow-400 mb-4">What Family Members Are Sharing</h3>
                <div className="space-y-3">
                  {submissions.map(sub => (
                    <div key={sub.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-yellow-500/30 transition-colors">
                      <p className="text-gray-200 mb-3">{sub.text}</p>
                      <button onClick={() => setSubmissions(submissions.map(s => s.id === sub.id ? {...s, votes: s.votes + 1} : s))} className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors">
                        <Heart size={16} />
                        <span>{sub.votes} people relate to this</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rules' && (
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Ground Rules for Our Talk</h2>
              <p className="text-gray-300 mb-6">Everyone picks rules they think will help. We will use the top 5.</p>

              <div className="mb-6">
                <div className="flex gap-2 mb-4">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-3 flex-1 rounded-full transition-all duration-300 ${selectedGroundRules.length > i ? 'bg-gradient-to-r from-yellow-500 to-amber-600' : 'bg-gray-700'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-400">{selectedGroundRules.length === 5 ? 'All 5 selected' : `Select ${5 - selectedGroundRules.length} more`}</p>
              </div>

              <div className="space-y-3">
                {groundRulesOptions.map((rule, i) => (
                  <button key={i} onClick={() => {
                    if (selectedGroundRules.includes(rule)) {
                      setSelectedGroundRules(selectedGroundRules.filter(r => r !== rule));
                    } else if (selectedGroundRules.length < 5) {
                      setSelectedGroundRules([...selectedGroundRules, rule]);
                    }
                  }} disabled={selectedGroundRules.length >= 5 && !selectedGroundRules.includes(rule)} className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${selectedGroundRules.includes(rule) ? 'border-yellow-500 bg-yellow-500/10 text-white' : selectedGroundRules.length >= 5 ? 'border-gray-800 bg-gray-900 text-gray-600' : 'border-gray-700 hover:border-yellow-500/50 text-gray-300 bg-gray-900'}`}>
                    <div className="flex items-center gap-3">
                      {selectedGroundRules.includes(rule) && <CheckCircle className="text-yellow-500" size={20} />}
                      <span>{rule}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'hopes' && (
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Our Shared Hopes</h2>
              <p className="text-gray-300 mb-6">What do you hope our family becomes?</p>

              <div className="mb-6">
                <input type="text" placeholder="I hope we..." className="w-full p-4 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500" onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    setHopes([...hopes, { id: Date.now(), text: e.target.value, author: 'You' }]);
                    e.target.value = '';
                  }
                }} />
                <p className="text-sm text-gray-400 mt-2">Press Enter to add</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hopes.map(hope => (
                  <div key={hope.id} className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border border-yellow-500/30 rounded-xl p-4">
                    <p className="text-gray-200 mb-2">{hope.text}</p>
                    <p className="text-sm text-yellow-400">- {hope.author}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'peacetalk' && (
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Peace Talk Guide</h2>
              <p className="text-gray-300 mb-6">Use these tools during your family conversation.</p>

              {!peaceTalkMode ? (
                <div className="space-y-4">
                  <button onClick={() => setPeaceTalkMode(true)} className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-4 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 text-lg font-bold shadow-lg shadow-yellow-500/20">Start Peace Talk Session</button>
                  <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                    <h3 className="font-bold text-yellow-400 mb-4">Before You Begin</h3>
                    <div className="space-y-3 text-gray-300">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-yellow-500 mt-1" size={20} />
                        <p>Review your ground rules together</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-yellow-500 mt-1" size={20} />
                        <p>Set a time limit (60-90 minutes max)</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-yellow-500 mt-1" size={20} />
                        <p>Choose a neutral moderator</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="text-yellow-500 mt-1" size={20} />
                        <p>Remember: progress over perfection</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border-2 border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-yellow-400">Current Speaker</h3>
                      <button onClick={() => setCurrentSpeaker((currentSpeaker + 1) % familyMembers.length)} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-4 py-2 rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 text-sm font-bold">Next Person</button>
                    </div>
                    <p className="text-2xl font-bold text-white">{familyMembers[currentSpeaker].name}</p>
                    <p className="text-sm text-yellow-400 mt-2">Everyone else: Listen without interrupting</p>
                  </div>

                  <div className={`bg-gradient-to-r ${conversationCards[currentCard].gradient} rounded-xl p-6 shadow-lg`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-black/70">{conversationCards[currentCard].category}</span>
                      <button onClick={() => setCurrentCard((currentCard + 1) % conversationCards.length)} className="text-sm text-black/70 hover:text-black font-medium">Draw Next Card</button>
                    </div>
                    <p className="text-lg font-bold text-black">{conversationCards[currentCard].question}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="border-2 border-amber-500 text-amber-400 bg-amber-500/10 py-3 rounded-xl hover:bg-amber-500/20 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                      <Pause size={20} />
                      Request Break
                    </button>
                    <button onClick={() => {
                      const agr = prompt('What did you agree on?');
                      if (agr) setAgreements([...agreements, { id: Date.now(), text: agr, time: 'Just now' }]);
                    }} className="border-2 border-yellow-500 text-yellow-400 bg-yellow-500/10 py-3 rounded-xl hover:bg-yellow-500/20 transition-all duration-300 flex items-center justify-center gap-2 font-medium">
                      <CheckCircle size={20} />
                      Mark Agreement
                    </button>
                  </div>

                  {agreements.length > 0 && (
                    <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border-2 border-yellow-500/30 rounded-xl p-4">
                      <h3 className="font-bold text-yellow-400 mb-3 flex items-center gap-2">
                        <Target size={20} className="text-yellow-500" />
                        Agreements Reached
                      </h3>
                      {agreements.map(agr => (
                        <div key={agr.id} className="flex items-start gap-2 mb-2">
                          <CheckCircle className="text-yellow-500 mt-1" size={16} />
                          <div>
                            <p className="text-gray-200">{agr.text}</p>
                            <p className="text-xs text-gray-400">{agr.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button onClick={() => setPeaceTalkMode(false)} className="w-full border-2 border-gray-700 text-gray-300 py-3 rounded-xl hover:bg-gray-800 transition-all duration-300">End Session</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-4 border border-yellow-500/20">
          <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
            <Map size={20} className="text-yellow-500" />
            Quick Tips
          </h3>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Complete Safe Share and Ground Rules before the peace talk</p>
            <p>• Progress happens in small steps, not one conversation</p>
            <p>• It is okay to feel uncomfortable - healing is not easy</p>
            <p>• Follow up in one week to check on agreements</p>
          </div>
        </div>
      </div>
    </div>
  );
}