import React, { useState, useEffect } from 'react';
import { Heart, Users, Shield, Sparkles, MessageCircle, Settings, LogOut, Home, Link2, Copy, Check, Eye } from 'lucide-react';

function FamilyResetApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showMemberJoin, setShowMemberJoin] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [spaces, setSpaces] = useState({});
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [spaceName, setSpaceName] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [memberName, setMemberName] = useState('');
  const [memberColor, setMemberColor] = useState('#EAB308');
  const [newRule, setNewRule] = useState('');
  const [selectedRuleTemplate, setSelectedRuleTemplate] = useState('');
  const [newHope, setNewHope] = useState('');
  const [hopeType, setHopeType] = useState('personal');
  const [newShare, setNewShare] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [likedRules, setLikedRules] = useState({});
  const [showLanding, setShowLanding] = useState(true);
  const [joinCode, setJoinCode] = useState('');

  const ruleTemplates = [
    "We listen without interrupting",
    "We speak with kindness and respect",
    "We take responsibility for our feelings",
    "We ask permission before giving advice",
    "We honor each other's boundaries",
    "We celebrate each other's wins",
    "We apologize when we hurt someone",
    "We practice patience and understanding"
  ];

  useEffect(() => {
    const saved = window.familyResetData || { spaces: {} };
    setSpaces(saved.spaces || {});
    const urlParams = new URLSearchParams(window.location.search);
    const spaceId = urlParams.get('space');
    
    if (spaceId && saved.spaces[spaceId]) {
      setCurrentSpace(saved.spaces[spaceId]);
      setShowMemberJoin(true);
      setShowAdminSetup(false);
      setShowAdminLogin(false);
      setShowLanding(false);
    } else if (Object.keys(saved.spaces || {}).length > 0) {
      setShowLanding(true);
      setShowAdminLogin(false);
      setShowAdminSetup(false);
      setShowMemberJoin(false);
    } else {
      setShowLanding(true);
      setShowAdminSetup(false);
      setShowAdminLogin(false);
      setShowMemberJoin(false);
    }
  }, []);

  useEffect(() => {
    window.familyResetData = { spaces };
  }, [spaces]);

  useEffect(() => {
    if (currentSpace && spaces[currentSpace.id]) {
      setCurrentSpace(spaces[currentSpace.id]);
    }
  }, [spaces, currentSpace]);

  const createSpace = () => {
    if (!adminName.trim() || !adminEmail.trim() || !adminPassword.trim() || !spaceName.trim()) return;
    const spaceId = Date.now().toString();
    const admin = {
      id: Date.now().toString() + '-admin',
      name: adminName.trim(),
      email: adminEmail.trim(),
      password: adminPassword,
      color: '#EAB308',
      role: 'admin',
      joinedAt: new Date().toISOString()
    };
    const newSpace = {
      id: spaceId,
      name: spaceName.trim(),
      description: spaceDescription.trim(),
      createdAt: new Date().toISOString(),
      admin: admin,
      members: [admin],
      groundRules: [],
      hopes: [],
      shares: []
    };
    setSpaces(prev => ({ ...prev, [spaceId]: newSpace }));
    setCurrentSpace(newSpace);
    setCurrentUser(admin);
    setShowAdminSetup(false);
    setShowLanding(false);
  };

  const adminLogin = () => {
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    
    console.log('Attempting login with:', loginEmail);
    console.log('Available spaces:', spaces);
    
    const userSpace = Object.values(spaces).find(space => 
      space.admin && 
      space.admin.email.toLowerCase() === loginEmail.trim().toLowerCase() && 
      space.admin.password === loginPassword
    );
    
    console.log('Found space:', userSpace);
    
    if (userSpace) {
      setCurrentSpace(userSpace);
      setCurrentUser(userSpace.admin);
      setShowAdminLogin(false);
      setShowLanding(false);
      setLoginEmail('');
      setLoginPassword('');
    } else {
      alert('Invalid email or password. Please check your credentials.');
    }
  };

  const joinWithCode = () => {
    if (!joinCode.trim()) return;
    
    console.log('Attempting to join with code:', joinCode.trim());
    console.log('Available spaces:', Object.keys(spaces));
    
    const foundSpace = spaces[joinCode.trim()];
    
    console.log('Found space:', foundSpace);
    
    if (foundSpace) {
      setCurrentSpace(foundSpace);
      setShowLanding(false);
      setShowMemberJoin(true);
      setJoinCode('');
    } else {
      alert('Invalid space code. Please check the code and try again.');
    }
  };

  const joinSpace = () => {
    if (!memberName.trim() || !currentSpace) return;
    const existingMember = currentSpace.members.find(m => m.name.toLowerCase() === memberName.trim().toLowerCase() && m.role !== 'admin');
    if (existingMember) {
      setCurrentUser(existingMember);
      setShowMemberJoin(false);
    } else {
      const newMember = {
        id: Date.now().toString(),
        name: memberName.trim(),
        color: memberColor,
        role: 'member',
        joinedAt: new Date().toISOString()
      };
      const updatedSpace = { ...currentSpace, members: [...currentSpace.members, newMember] };
      setSpaces(prev => ({ ...prev, [currentSpace.id]: updatedSpace }));
      setCurrentSpace(updatedSpace);
      setCurrentUser(newMember);
      setShowMemberJoin(false);
    }
    setMemberName('');
  };

  const generateInviteLink = () => {
    return currentSpace.id;
  };

  const copyInviteLink = () => {
    const link = generateInviteLink();
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentSpace(null);
    setShowLanding(true);
    setActiveTab('home');
    setShowSettings(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const addGroundRule = () => {
    if (!currentUser || !currentSpace) return;
    const ruleText = selectedRuleTemplate || newRule.trim();
    if (!ruleText) return;
    
    const rule = {
      id: Date.now().toString(),
      text: ruleText,
      author: currentUser.name,
      authorColor: currentUser.color,
      createdAt: new Date().toISOString()
    };
    const updatedSpace = { ...currentSpace, groundRules: [...currentSpace.groundRules, rule] };
    setSpaces(prev => ({ ...prev, [currentSpace.id]: updatedSpace }));
    setNewRule('');
    setSelectedRuleTemplate('');
  };

  const addHope = () => {
    if (!currentUser || !currentSpace) return;
    if (!newHope.trim()) return;
    const hope = {
      id: Date.now().toString(),
      text: newHope.trim(),
      type: hopeType,
      author: currentUser.name,
      authorColor: currentUser.color,
      createdAt: new Date().toISOString()
    };
    const updatedSpace = { ...currentSpace, hopes: [...currentSpace.hopes, hope] };
    setSpaces(prev => ({ ...prev, [currentSpace.id]: updatedSpace }));
    setNewHope('');
  };

  const addShare = () => {
    if (!currentUser || !currentSpace) return;
    if (!newShare.trim()) return;
    const share = {
      id: Date.now().toString(),
      text: newShare.trim(),
      author: currentUser.name,
      authorColor: currentUser.color,
      createdAt: new Date().toISOString()
    };
    const updatedSpace = { ...currentSpace, shares: [...currentSpace.shares, share] };
    setSpaces(prev => ({ ...prev, [currentSpace.id]: updatedSpace }));
    setNewShare('');
  };

  const startEditProfile = () => {
    if (!currentUser) return;
    setEditName(currentUser.name);
    setEditColor(currentUser.color);
    setEditingProfile(true);
  };

  const saveProfile = () => {
    if (!currentUser || !currentSpace) return;
    if (!editName.trim()) return;
    const updatedUser = { ...currentUser, name: editName.trim(), color: editColor };
    const updatedMembers = currentSpace.members.map(m => m.id === currentUser.id ? updatedUser : m);
    const updatedRules = currentSpace.groundRules.map(r => r.author === currentUser.name ? {...r, author: editName.trim(), authorColor: editColor} : r);
    const updatedHopes = currentSpace.hopes.map(h => h.author === currentUser.name ? {...h, author: editName.trim(), authorColor: editColor} : h);
    const updatedShares = currentSpace.shares.map(s => s.author === currentUser.name ? {...s, author: editName.trim(), authorColor: editColor} : s);
    const updatedSpace = {
      ...currentSpace,
      members: updatedMembers,
      groundRules: updatedRules,
      hopes: updatedHopes,
      shares: updatedShares,
      admin: currentUser.role === 'admin' ? updatedUser : currentSpace.admin
    };
    setSpaces(prev => ({ ...prev, [currentSpace.id]: updatedSpace }));
    setCurrentUser(updatedUser);
    setEditingProfile(false);
  };

  const toggleLikeRule = (ruleId) => {
    if (!currentUser || !currentSpace) return;
    
    const updatedRules = currentSpace.groundRules.map(rule => {
      if (rule.id === ruleId) {
        const likes = rule.likes || [];
        const hasLiked = likes.includes(currentUser.id);
        return {
          ...rule,
          likes: hasLiked 
            ? likes.filter(id => id !== currentUser.id)
            : [...likes, currentUser.id]
        };
      }
      return rule;
    });
    
    const updatedSpace = { ...currentSpace, groundRules: updatedRules };
    setSpaces(prev => ({ ...prev, [currentSpace.id]: updatedSpace }));
  };

  const cancelEdit = () => {
    setEditingProfile(false);
    setEditName('');
    setEditColor('');
  };

  if (showLanding) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Heart className="w-20 h-20 mx-auto mb-6 text-yellow-500" strokeWidth={3} />
            <h1 className="text-4xl font-bold text-yellow-500 mb-3">Welcome Back</h1>
            <p className="text-gray-300 text-lg">Sign in to your healing space</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-yellow-500 mb-2">Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-4 py-3 bg-transparent border-2 border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-yellow-500 mb-2">Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && adminLogin()} className="w-full px-4 py-3 bg-transparent border-2 border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="Password" />
            </div>
            <button onClick={adminLogin} className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition text-lg">Sign In</button>
            <button onClick={() => { setShowLanding(false); setShowAdminSetup(true); }} className="w-full bg-transparent border-2 border-yellow-500 text-yellow-500 py-3 rounded-lg font-bold hover:bg-gray-900 transition">Create New Space</button>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-gray-500">OR</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-yellow-500 mb-2">Join with Code</label>
              <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && joinWithCode()} className="w-full px-4 py-3 bg-transparent border-2 border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="Enter space code" />
            </div>
            <button onClick={joinWithCode} className="w-full bg-gray-800 border-2 border-yellow-500 text-yellow-500 py-3 rounded-lg font-bold hover:bg-gray-700 transition">Join Space</button>
          </div>
        </div>
      </div>
    );
  }

  if (showAdminSetup) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-3xl font-bold text-yellow-500 mb-2">Family Reset</h1>
            <p className="text-gray-300">Create a healing space for your family</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Your Name</label>
              <input type="text" value={adminName} onChange={(e) => setAdminName(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="Full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Email</label>
              <input type="email" value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Password</label>
              <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="Create password" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Space Name</label>
              <input type="text" value={spaceName} onChange={(e) => setSpaceName(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="Our Family Space" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Description</label>
              <textarea value={spaceDescription} onChange={(e) => setSpaceDescription(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 resize-none" rows="2" placeholder="A space for our blended family to heal together" />
            </div>
            <button onClick={createSpace} className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition">Create Space</button>
          </div>
        </div>
      </div>
    );
  }

  if (showAdminLogin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-3xl font-bold text-yellow-500 mb-2">Welcome Back</h1>
            <p className="text-gray-300">Sign in to your healing space</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Email</label>
              <input type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Password</label>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && adminLogin()} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="Password" />
            </div>
            <button onClick={adminLogin} className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition">Sign In</button>
            <button onClick={() => { setShowAdminLogin(false); setShowAdminSetup(true); }} className="w-full bg-gray-800 border border-yellow-500 text-yellow-500 py-3 rounded-lg font-bold hover:bg-gray-700 transition">Create New Space</button>
          </div>
        </div>
      </div>
    );
  }

  if (showMemberJoin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h1 className="text-3xl font-bold text-yellow-500 mb-2">{currentSpace.name}</h1>
            <p className="text-gray-300">{currentSpace.description || 'Join this healing space'}</p>
            <p className="text-sm text-gray-400 mt-2">Created by {currentSpace.admin.name}</p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Your Name</label>
              <input type="text" value={memberName} onChange={(e) => setMemberName(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && joinSpace()} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500" placeholder="Enter your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-yellow-500 mb-2">Choose Your Color</label>
              <div className="flex gap-2">
                {['#EAB308', '#EF4444', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map(color => (
                  <button key={color} onClick={() => setMemberColor(color)} className={memberColor === color ? 'w-12 h-12 rounded-full border-4 transition border-yellow-500 scale-110' : 'w-12 h-12 rounded-full border-4 transition border-gray-700'} style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
            <button onClick={joinSpace} className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition">Join Space</button>
          </div>
        </div>
      </div>
    );
  }

  if (showInviteModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50">
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6 max-w-md w-full">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Invite Family Members</h2>
          <p className="text-gray-300 mb-4">Share this code with family members to invite them to your space</p>
          <div className="bg-gray-900 border border-yellow-500 p-4 rounded-lg mb-4 text-center">
            <p className="text-yellow-400 text-2xl font-bold tracking-wider">{generateInviteLink()}</p>
          </div>
          <p className="text-gray-400 text-sm mb-4">They can enter this code on the landing page to join</p>
          <div className="flex gap-2">
            <button onClick={copyInviteLink} className="flex-1 bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center justify-center gap-2">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied' : 'Copy Code'}
            </button>
            <button onClick={() => setShowInviteModal(false)} className="flex-1 bg-gray-800 text-yellow-500 border border-yellow-500 py-3 rounded-lg font-bold hover:bg-gray-700 transition">Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) {
    if (!currentUser) {
      setShowSettings(false);
      return null;
    }
    
    return (
      <div className="min-h-screen bg-black">
        <div className="max-w-2xl mx-auto p-4">
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6 mb-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-yellow-500">Settings</h2>
              <button onClick={() => setShowSettings(false)} className="text-yellow-500 hover:text-yellow-400"><Home className="w-6 h-6" /></button>
            </div>
            {editingProfile ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-500 mb-2">Name</label>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-500 mb-2">Color</label>
                  <div className="flex gap-2">
                    {['#EAB308', '#EF4444', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'].map(color => (
                      <button key={color} onClick={() => setEditColor(color)} className={editColor === color ? 'w-12 h-12 rounded-full border-4 transition border-yellow-500 scale-110' : 'w-12 h-12 rounded-full border-4 transition border-gray-700'} style={{ backgroundColor: color }} />
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveProfile} className="flex-1 bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">Save Changes</button>
                  <button onClick={cancelEdit} className="flex-1 bg-gray-800 border border-yellow-500 text-yellow-500 py-2 rounded-lg font-bold hover:bg-gray-700">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-900 border border-yellow-500 rounded-lg">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold" style={{ backgroundColor: currentUser.color }}>{currentUser.name.charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-yellow-500">{currentUser.name}</h3>
                    <p className="text-sm text-gray-400">{currentUser.role === 'admin' ? 'Space Admin' : 'Member'} since {new Date(currentUser.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <button onClick={startEditProfile} className="w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">Edit Profile</button>
                {currentUser.role === 'admin' && (
                  <button onClick={() => { setShowSettings(false); setShowInviteModal(true); }} className="w-full bg-gray-800 border-2 border-yellow-500 text-yellow-500 py-2 rounded-lg font-bold hover:bg-gray-700 flex items-center justify-center gap-2">
                    <Link2 className="w-5 h-5" />Invite Members
                  </button>
                )}
                <button onClick={handleLogout} className="w-full bg-red-600 text-white py-2 rounded-lg font-bold hover:bg-red-500 flex items-center justify-center gap-2">
                  <LogOut className="w-5 h-5" />Leave Space
                </button>
              </div>
            )}
          </div>
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6">
            <h3 className="font-bold text-lg text-yellow-500 mb-4">Space Members ({currentSpace.members.length})</h3>
            <div className="space-y-2">
              {currentSpace.members.map(member => (
                <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-900 border border-yellow-500 rounded-lg">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: member.color }}>{member.name.charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-xs text-gray-400">{member.role === 'admin' ? 'Admin' : 'Member'} - Joined {new Date(member.joinedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser || !currentSpace) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6 mb-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-yellow-500" />
              <div>
                <h1 className="text-2xl font-bold text-yellow-500">{currentSpace.name}</h1>
                <p className="text-sm text-gray-400">Welcome, {currentUser.name}</p>
              </div>
            </div>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-gray-800 rounded-lg"><Settings className="w-6 h-6 text-yellow-500" /></button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button onClick={() => setActiveTab('home')} className={activeTab === 'home' ? 'px-4 py-2 rounded-lg font-bold whitespace-nowrap transition bg-yellow-500 text-black' : 'px-4 py-2 rounded-lg font-bold whitespace-nowrap transition bg-gray-800 text-yellow-500 border border-yellow-500'}>
              <Users className="w-4 h-4 inline mr-2" />Dashboard
            </button>
            <button onClick={() => setActiveTab('rules')} className={activeTab === 'rules' ? 'px-4 py-2 rounded-lg font-bold whitespace-nowrap transition bg-yellow-500 text-black' : 'px-4 py-2 rounded-lg font-bold whitespace-nowrap transition bg-gray-800 text-yellow-500 border border-yellow-500'}>
              <Shield className="w-4 h-4 inline mr-2" />Ground Rules
            </button>
            <button onClick={() => setActiveTab('hopes')} className={activeTab === 'hopes' ? 'px-4 py-2 rounded-lg font-bold whitespace-nowrap transition bg-yellow-500 text-black' : 'px-4 py-2 rounded-lg font-bold whitespace-nowrap transition bg-gray-800 text-yellow-500 border border-yellow-500'}>
              <Sparkles className="w-4 h-4 inline mr-2" />Hopes
            </button>
            <button onClick={() => setActiveTab('share')} className={activeTab === 'share' ? 'px-4 py-2 rounded-lg font-bold whitespace-nowrap transition bg-yellow-500 text-black' : 'px-4 py-2 rounded-lg font-bold whitespace-nowrap transition bg-gray-800 text-yellow-500 border border-yellow-500'}>
              <MessageCircle className="w-4 h-4 inline mr-2" />Personal Views
            </button>
          </div>
        </div>

        {activeTab === 'home' && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-yellow-500">My Dashboard</h2>
                {currentUser.role === 'admin' && (
                  <button onClick={() => setShowInviteModal(true)} className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 text-sm font-bold flex items-center gap-2">
                    <Link2 className="w-4 h-4" />Invite
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900 border border-yellow-500 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-yellow-500">{currentSpace.members.length}</p>
                  <p className="text-sm text-gray-400">Members</p>
                </div>
                <div className="bg-gray-900 border border-blue-500 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-400">{currentSpace.groundRules.length}</p>
                  <p className="text-sm text-gray-400">Ground Rules</p>
                </div>
                <div className="bg-gray-900 border border-purple-500 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-400">{currentSpace.hopes.length}</p>
                  <p className="text-sm text-gray-400">Hopes Shared</p>
                </div>
                <div className="bg-gray-900 border border-green-500 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-400">{currentSpace.shares.length}</p>
                  <p className="text-sm text-gray-400">Personal Views</p>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-yellow-500">My Contributions</h3>
                {currentSpace.groundRules.filter(r => r.author === currentUser.name).length > 0 && (
                  <div className="bg-gray-900 border border-blue-500 p-3 rounded-lg">
                    <p className="text-sm font-medium text-blue-400 mb-2">Ground Rules ({currentSpace.groundRules.filter(r => r.author === currentUser.name).length})</p>
                    {currentSpace.groundRules.filter(r => r.author === currentUser.name).slice(0, 2).map(rule => (
                      <p key={rule.id} className="text-sm text-gray-300 truncate">• {rule.text}</p>
                    ))}
                  </div>
                )}
                {currentSpace.hopes.filter(h => h.author === currentUser.name).length > 0 && (
                  <div className="bg-gray-900 border border-purple-500 p-3 rounded-lg">
                    <p className="text-sm font-medium text-purple-400 mb-2">Hopes ({currentSpace.hopes.filter(h => h.author === currentUser.name).length})</p>
                    {currentSpace.hopes.filter(h => h.author === currentUser.name).slice(0, 2).map(hope => (
                      <p key={hope.id} className="text-sm text-gray-300 truncate">• {hope.text}</p>
                    ))}
                  </div>
                )}
                {currentSpace.shares.filter(s => s.author === currentUser.name).length > 0 && (
                  <div className="bg-gray-900 border border-green-500 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-400 mb-2">Personal Views ({currentSpace.shares.filter(s => s.author === currentUser.name).length})</p>
                    {currentSpace.shares.filter(s => s.author === currentUser.name).slice(0, 2).map(share => (
                      <p key={share.id} className="text-sm text-gray-300 truncate">• {share.text}</p>
                    ))}
                  </div>
                )}
                {currentSpace.groundRules.filter(r => r.author === currentUser.name).length === 0 &&
                 currentSpace.hopes.filter(h => h.author === currentUser.name).length === 0 &&
                 currentSpace.shares.filter(s => s.author === currentUser.name).length === 0 && (
                  <p className="text-center text-gray-500 py-4">No contributions yet. Start sharing in the tabs above.</p>
                )}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6">
              <h3 className="font-bold text-lg text-yellow-500 mb-4">Family Members</h3>
              <div className="space-y-2">
                {currentSpace.members.map(member => (
                  <div key={member.id} className="flex items-center gap-3 p-3 bg-gray-900 border border-yellow-500 rounded-lg">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ backgroundColor: member.color }}>{member.name.charAt(0).toUpperCase()}</div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{member.name} {member.id === currentUser.id && '(You)'}</p>
                      <p className="text-xs text-gray-400">{member.role === 'admin' && 'Admin'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Ground Rules</h2>
            
            <div className="bg-gray-900 border border-yellow-500 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Quick Tips
              </h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Select up to 5 rules for your peace talk</li>
                <li>• Like rules you agree with to show support</li>
                <li>• Complete this before starting difficult conversations</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-yellow-500 mb-2">Choose a Template</label>
              <select value={selectedRuleTemplate} onChange={(e) => setSelectedRuleTemplate(e.target.value)} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white mb-3">
                <option value="">Select a ground rule template...</option>
                {ruleTemplates.map((template, idx) => (
                  <option key={idx} value={template}>{template}</option>
                ))}
              </select>
              
              <label className="block text-sm font-medium text-yellow-500 mb-2">Or Write Your Own</label>
              <textarea value={newRule} onChange={(e) => setNewRule(e.target.value)} placeholder="Add a custom ground rule" className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 resize-none" rows="3" />
              <button onClick={addGroundRule} className="mt-2 w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">Add Rule</button>
            </div>
            <div className="space-y-3">
              {currentSpace.groundRules.map(rule => {
                const likes = rule.likes || [];
                const hasLiked = likes.includes(currentUser.id);
                return (
                  <div key={rule.id} className="p-4 bg-gray-900 rounded-lg border-l-4" style={{ borderColor: rule.authorColor }}>
                    <p className="text-white mb-2">{rule.text}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: rule.authorColor }}>{rule.author.charAt(0).toUpperCase()}</div>
                        <span>{rule.author}</span>
                        <span>•</span>
                        <span>{new Date(rule.createdAt).toLocaleDateString()}</span>
                      </div>
                      <button onClick={() => toggleLikeRule(rule.id)} className="flex items-center gap-1 text-sm">
                        <Heart className={hasLiked ? 'w-5 h-5 fill-yellow-500 text-yellow-500' : 'w-5 h-5 text-gray-500'} />
                        <span className={hasLiked ? 'text-yellow-500 font-bold' : 'text-gray-500'}>{likes.length}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
              {currentSpace.groundRules.length === 0 && (<p className="text-center text-gray-500 py-8">No ground rules yet. Be the first to add one.</p>)}
            </div>
          </div>
        )}

        {activeTab === 'hopes' && (
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Our Hopes</h2>
            
            <div className="bg-gray-900 border border-yellow-500 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Quick Tips
              </h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Personal hopes are for individual growth</li>
                <li>• Collective hopes are for family goals</li>
                <li>• Be specific and positive in your hopes</li>
                <li>• Follow up in one week to check progress</li>
              </ul>
            </div>
            
            <div className="mb-4">
              <div className="flex gap-2 mb-3">
                <button onClick={() => setHopeType('personal')} className={hopeType === 'personal' ? 'flex-1 bg-yellow-500 text-black py-2 rounded-lg font-bold' : 'flex-1 bg-gray-800 border border-yellow-500 text-yellow-500 py-2 rounded-lg font-bold'}>
                  Personal Hope
                </button>
                <button onClick={() => setHopeType('collective')} className={hopeType === 'collective' ? 'flex-1 bg-yellow-500 text-black py-2 rounded-lg font-bold' : 'flex-1 bg-gray-800 border border-yellow-500 text-yellow-500 py-2 rounded-lg font-bold'}>
                  Collective Hope
                </button>
              </div>
              <textarea value={newHope} onChange={(e) => setNewHope(e.target.value)} placeholder={hopeType === 'personal' ? 'Share a personal hope...' : 'Share a hope for our family...'} className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 resize-none" rows="3" />
              <button onClick={addHope} className="mt-2 w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">Share Hope</button>
            </div>
            <div className="space-y-3">
              {currentSpace.hopes.map(hope => (
                <div key={hope.id} className="p-4 bg-gray-900 rounded-lg border-l-4" style={{ borderColor: hope.authorColor }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={hope.type === 'personal' ? 'text-xs px-2 py-1 rounded bg-purple-900 text-purple-300' : 'text-xs px-2 py-1 rounded bg-blue-900 text-blue-300'}>
                      {hope.type === 'personal' ? 'Personal' : 'Collective'}
                    </span>
                  </div>
                  <p className="text-white mb-2">{hope.text}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: hope.authorColor }}>{hope.author.charAt(0).toUpperCase()}</div>
                    <span>{hope.author}</span>
                    <span>•</span>
                    <span>{new Date(hope.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {currentSpace.hopes.length === 0 && (<p className="text-center text-gray-500 py-8">No hopes shared yet. Be the first to share.</p>)}
            </div>
          </div>
        )}

        {activeTab === 'share' && (
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Personal Views</h2>
            
            <div className="bg-gray-900 border border-yellow-500 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-500 font-bold mb-2 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Quick Tips
              </h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• Share your perspective without judgment</li>
                <li>• Use "I feel" statements instead of "You always"</li>
                <li>• This is a safe space for honest feelings</li>
                <li>• Progress happens in small steps</li>
              </ul>
            </div>
            
            <p className="text-gray-400 text-sm mb-4">Share your personal perspective and feelings in a safe space</p>
            <div className="mb-4">
              <textarea value={newShare} onChange={(e) => setNewShare(e.target.value)} placeholder="Share your personal view or feeling..." className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 resize-none" rows="3" />
              <button onClick={addShare} className="mt-2 w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">Share View</button>
            </div>
            <div className="space-y-3">
              {currentSpace.shares.map(share => (
                <div key={share.id} className="p-4 bg-gray-900 rounded-lg border-l-4" style={{ borderColor: share.authorColor }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-green-400">Personal View</span>
                  </div>
                  <p className="text-white mb-2">{share.text}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: share.authorColor }}>{share.author.charAt(0).toUpperCase()}</div>
                    <span>{share.author}</span>
                    <span>•</span>
                    <span>{new Date(share.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {currentSpace.shares.length === 0 && (<p className="text-center text-gray-500 py-8">No personal views shared yet. Be the first to share.</p>)}
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700 text-center">
              <p className="text-gray-500 text-xs">© 2025 Ayende Consulting. All rights reserved.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FamilyResetApp;