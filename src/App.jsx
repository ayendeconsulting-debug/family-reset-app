import React, { useState, useEffect } from 'react';
import { Heart, Send, EyeOff, Users, Pause, CheckCircle, Target, Lightbulb, Shield, Map, UserPlus, Copy, Mail, LogIn, User, Settings, Sparkles, X, Save, Share2, Link2, Check, LogOut } from 'lucide-react';

export default function BlendedFamilyResetApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showJoinFamily, setShowJoinFamily] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [userName, setUserName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  
  const [emailConfig, setEmailConfig] = useState({
    senderEmail: '',
    senderName: '',
    subject: 'Join Our Family Healing Journey',
    message: ''
  });

  const [inviteEmails, setInviteEmails] = useState('');
  
  const [userProfile, setUserProfile] = useState({
    name: '',
    age: '',
    role: '',
    ambitions: '',
    dreams: '',
    interests: '',
    bio: '',
    email: ''
  });

  const [familyMembers, setFamilyMembers] = useState([]);
  const [pendingInvites, setPendingInvites] = useState([]);
  const [activeTab, setActiveTab] = useState('anonymous');
  const [anonymousText, setAnonymousText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [selectedGroundRules, setSelectedGroundRules] = useState([]);
  const [hopes, setHopes] = useState([]);
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

  useEffect(() => {
    checkAuthStatus();
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setJoinCode(code);
    }
  }, []);

  useEffect(() => {
    if (generatedCode) {
      const baseUrl = window.location.origin + window.location.pathname;
      setInviteLink(`${baseUrl}?code=${generatedCode}`);
    }
  }, [generatedCode]);

  useEffect(() => {
    if (isAuthenticated && currentUserId) {
      loadUserSession();
    }
  }, [isAuthenticated, currentUserId]);

  const checkAuthStatus = () => {
    const session = localStorage.getItem('familyResetSession');
    if (session) {
      const sessionData = JSON.parse(session);
      setIsAuthenticated(true);
      setCurrentUserId(sessionData.userId);
      setUserProfile({ ...userProfile, email: sessionData.email });
    } else {
      setShowLoginModal(true);
    }
  };

  const loadUserSession = () => {
    const userDataKey = `userData_${currentUserId}`;
    const userData = localStorage.getItem(userDataKey);
    
    if (userData) {
      const data = JSON.parse(userData);
      setIsRegistered(data.isRegistered || false);
      setFamilyName(data.familyName || '');
      setUserName(data.userName || '');
      setIsOrganizer(data.isOrganizer || false);
      setGeneratedCode(data.familyCode || '');
      setJoinCode(data.familyCode || '');
      setUserProfile(data.userProfile || userProfile);
      setFamilyMembers(data.familyMembers || []);
      setPendingInvites(data.pendingInvites || []);
      setSubmissions(data.submissions || []);
      setHopes(data.hopes || []);
      setAgreements(data.agreements || []);
      setSelectedGroundRules(data.selectedGroundRules || []);
    }
  };

  const saveUserSession = (data) => {
    const userDataKey = `userData_${currentUserId}`;
    const existingData = localStorage.getItem(userDataKey);
    const currentData = existingData ? JSON.parse(existingData) : {};
    
    const updatedData = { ...currentData, ...data };
    localStorage.setItem(userDataKey, JSON.stringify(updatedData));
  };

  const handleLogin = () => {
    if (!loginEmail || !loginPassword) {
      alert('Please enter both email and password');
      return;
    }

    const usersKey = 'familyResetUsers';
    const users = JSON.parse(localStorage.getItem(usersKey) || '{}');

    if (isSignUp) {
      if (users[loginEmail]) {
        alert('This email is already registered. Please login instead.');
        return;
      }
      
      const userId = 'user_' + Date.now();
      users[loginEmail] = {
        userId,
        email: loginEmail,
        password: loginPassword,
        createdAt: new Date().toISOString()
      };
      
      localStorage.setItem(usersKey, JSON.stringify(users));
      localStorage.setItem('familyResetSession', JSON.stringify({ userId, email: loginEmail }));
      
      setCurrentUserId(userId);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setUserProfile({ ...userProfile, email: loginEmail });
      
      alert('Account created successfully!');
    } else {
      const user = users[loginEmail];
      
      if (!user) {
        alert('No account found with this email. Please sign up first.');
        return;
      }
      
      if (user.password !== loginPassword) {
        alert('Incorrect password');
        return;
      }
      
      localStorage.setItem('familyResetSession', JSON.stringify({ userId: user.userId, email: loginEmail }));
      setCurrentUserId(user.userId);
      setIsAuthenticated(true);
      setShowLoginModal(false);
      setUserProfile({ ...userProfile, email: loginEmail });
    }

    setLoginEmail('');
    setLoginPassword('');
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('familyResetSession');
      setIsAuthenticated(false);
      setIsRegistered(false);
      setShowLoginModal(true);
      window.location.reload();
    }
  };

  const handleCreateFamily = () => {
    if (familyName.trim() && userName.trim()) {
      const code = 'FAM' + Math.random().toString(36).substring(2, 8).toUpperCase();
      setGeneratedCode(code);
      setIsRegistered(true);
      setIsOrganizer(true);
      setShowCreateFamily(false);
      setUserProfile({ ...userProfile, name: userName, role: 'Organizer' });
      
      const newMember = {
        id: Date.now(),
        name: userName,
        role: 'Organizer',
        status: 'Active',
        joinedDate: new Date().toISOString()
      };
      setFamilyMembers([newMember]);
      
      saveUserSession({
        isRegistered: true,
        familyName,
        userName,
        isOrganizer: true,
        familyCode: code,
        userProfile: { ...userProfile, name: userName, role: 'Organizer' },
        familyMembers: [newMember]
      });
    }
  };

  const handleJoinFamily = () => {
    if (joinCode.trim() && userName.trim()) {
      setIsRegistered(true);
      setIsOrganizer(false);
      setShowJoinFamily(false);
      setUserProfile({ ...userProfile, name: userName, role: 'Family Member' });
      
      const newMember = {
        id: Date.now(),
        name: userName,
        role: 'Family Member',
        status: 'Active',
        joinedDate: new Date().toISOString()
      };
      
      setFamilyMembers([newMember]);
      
      saveUserSession({
        isRegistered: true,
        familyName: familyName || 'My Family',
        userName,
        isOrganizer: false,
        familyCode: joinCode,
        userProfile: { ...userProfile, name: userName, role: 'Family Member' },
        familyMembers: [newMember]
      });
    }
  };

  const handleSaveProfile = () => {
    setShowSettings(false);
    saveUserSession({ userProfile });
    alert('Profile saved successfully');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleShareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Join ${familyName} - Family Reset`,
          text: `Join our family healing journey. Code: ${generatedCode}`,
          url: inviteLink
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  if (!isAuthenticated || showLoginModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]"></div>
        <div className="max-w-md w-full relative z-10">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-yellow-500/20">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <Heart className="text-yellow-500" size={48} fill="currentColor" />
                <Sparkles className="absolute -top-1 -right-1 text-amber-400" size={20} />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Family Reset</h1>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2 text-center">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p className="text-center text-gray-400 mb-6">{isSignUp ? 'Sign up to start your healing journey' : 'Login to continue your journey'}</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">Email</label>
                <input 
                  type="email" 
                  value={loginEmail} 
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-2">Password</label>
                <input 
                  type="password" 
                  value={loginPassword} 
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full p-3 bg-gray-900 border-2 border-gray-700 text-white rounded-xl focus:outline-none focus:border-yellow-500 transition-colors"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <button 
                onClick={handleLogin}
                className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black py-3 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 font-bold"
              >
                {isSignUp ? 'Sign Up' : 'Login'}
              </button>

              <div className="text-center">
                <button 
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-yellow-400 hover:text-yellow-300 text-sm transition-colors"
                >
                  {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>

            <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
              <p className="text-xs text-yellow-200 text-center">
                Your account keeps you connected to your family space across all devices
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]"></div>
        <div className="max-w-md w-full relative z-10">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 mb-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Heart className="text-yellow-500" size={40} fill="currentColor" />
                  <Sparkles className="absolute -top-1 -right-1 text-amber-400" size={16} />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">Family Reset</h1>
              </div>
              <button onClick={handleLogout} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Logout">
                <LogOut className="text-gray-400" size={20} />
              </button>
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
                  <p className="text-sm text-yellow-200">You will get a shareable link and code to invite family members.</p>
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
            <div className="flex gap-2">
              <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
                <Settings className="text-yellow-500" size={24} />
              </button>
              <button onClick={handleLogout} className="p-2 hover:bg-gray-700 rounded-lg transition-colors" title="Logout">
                <LogOut className="text-gray-400" size={24} />
              </button>
            </div>
          </div>
        </div>

        {isOrganizer && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-6 mb-6 border border-yellow-500/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-yellow-400">Family Members</h2>
              <div className="flex gap-2">
                <button onClick={handleCopyCode} className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors text-sm border border-yellow-500/30">
                  {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                  {copiedCode ? 'Copied!' : generatedCode}
                </button>
                <button onClick={handleShareLink} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 text-sm font-bold">
                  <Share2 size={16} />
                  Share
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

            <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3">
              <p className="text-xs text-yellow-200">Share link: {inviteLink}</p>
            </div>
          </div>
        )}

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
              <p className="text-gray-300 mb-6">Share what matters to you.</p>
              
              <div className="mb-6">
                <textarea value={anonymousText} onChange={(e) => setAnonymousText(e.target.value)} placeholder="What do you want the family to know?" className="w-full h-32 p-4 bg-gray-900 border-2 border-gray-700 text-white rounded-xl resize-none focus:outline-none focus:border-yellow-500 transition-colors placeholder-gray-500" />
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="rounded accent-yellow-500" />
                    Keep anonymous
                  </label>
                  <button onClick={() => {
                    if (anonymousText.trim()) {
                      const newSubmissions = [{ id: Date.now(), text: anonymousText, votes: 0 }, ...submissions];
                      setSubmissions(newSubmissions);
                      saveUserSession({ submissions: newSubmissions });
                      setAnonymousText('');
                    }
                  }} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-6 py-2 rounded-xl hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 flex items-center gap-2 font-bold">
                    <Send size={18} />
                    Submit
                  </button>
                </div>
              </div>

              {submissions.length > 0 && (
                <div className="border-t border-gray-700 pt-6">
                  <h3 className="font-bold text-yellow-400 mb-4">What Family Members Are Sharing</h3>
                  <div className="space-y-3">
                    {submissions.map(sub => (
                      <div key={sub.id} className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-yellow-500/30 transition-colors">
                        <p className="text-gray-200 mb-3">{sub.text}</p>
                        <button onClick={() => {
                          const updated = submissions.map(s => s.id === sub.id ? {...s, votes: s.votes + 1} : s);
                          setSubmissions(updated);
                          saveUserSession({ submissions: updated });
                        }} className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors">
                          <Heart size={16} />
                          <span>{sub.votes} people relate to this</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'rules' && (
            <div>
              <h2 className="text-xl font-bold text-yellow-400 mb-2">Ground Rules</h2>
              <p className="text-gray-300 mb-6">Select up to 5 rules for your peace talk.</p>

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
                    let updated;
                    if (selectedGroundRules.includes(rule)) {
                      updated = selectedGroundRules.filter(r => r !== rule);
                    } else if (selectedGroundRules.length < 5) {
                      updated = [...selectedGroundRules, rule];
                    } else {
                      return;
                    }
                    setSelectedGroundRules(updated);
                    saveUserSession({ selectedGroundRules: updated });
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
                    const newHopes = [...hopes, { id: Date.now(), text: e.target.value, author: userName }];
                    setHopes(newHopes);
                    saveUserSession({ hopes: newHopes });
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
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/10 border-2 border-yellow-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-yellow-400">Current Speaker</h3>
                      <button onClick={() => setCurrentSpeaker((currentSpeaker + 1) % Math.max(familyMembers.length, 1))} className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-4 py-2 rounded-lg hover:from-yellow-400 hover:to-amber-500 transition-all duration-300 text-sm font-bold">Next Person</button>
                    </div>
                    <p className="text-2xl font-bold text-white">{familyMembers[currentSpeaker]?.name || userName}</p>
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
                      if (agr) {
                        const newAgreements = [...agreements, { id: Date.now(), text: agr, time: 'Just now' }];
                        setAgreements(newAgreements);
                        saveUserSession({ agreements: newAgreements });
                      }
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
            <p>• Your data saves automatically to your browser</p>
            <p>• Complete Safe Share and Ground Rules before the peace talk</p>
            <p>• Progress happens in small steps</p>
            <p>• Follow up in one week to check on agreements</p>
          </div>
        </div>
      </div>
    </div>
  );
}