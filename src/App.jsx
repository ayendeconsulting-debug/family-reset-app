import React, { useState, useEffect } from 'react';
import { Heart, Users, Shield, Sparkles, MessageCircle, Settings, LogOut, Home, Link2, Copy, Check } from 'lucide-react';

function FamilyResetApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentSpace, setCurrentSpace] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showAdminSetup, setShowAdminSetup] = useState(true);
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
  const [memberName, setMemberName] = useState('');
  const [memberColor, setMemberColor] = useState('#EAB308');
  const [newRule, setNewRule] = useState('');
  const [newHope, setNewHope] = useState('');
  const [newShare, setNewShare] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');

  useEffect(() => {
    const saved = window.familyResetData || { spaces: {} };
    setSpaces(saved.spaces || {});
    const urlParams = new URLSearchParams(window.location.search);
    const spaceId = urlParams.get('space');
    if (spaceId && saved.spaces[spaceId]) {
      setCurrentSpace(saved.spaces[spaceId]);
      setShowAdminSetup(false);
      setShowMemberJoin(true);
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
  };

  const joinSpace = () => {
    if (!memberName.trim() || !currentSpace) return;
    const existingMember = currentSpace.members.find(m => m.name.toLowerCase() === memberName.trim().toLowerCase() && m.role !== 'admin');
    if (existingMember) {
      setCurrentUser(existingMember);
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
      setCurrentUser(newMember);
    }
    setShowMemberJoin(false);
    setMemberName('');
  };

  const generateInviteLink = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    return baseUrl + '?space=' + currentSpace.id;
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
    setShowAdminSetup(true);
    setActiveTab('home');
    setShowSettings(false);
    window.history.replaceState({}, '', window.location.pathname);
  };

  const addGroundRule = () => {
    if (!newRule.trim()) return;
    const rule = {
      id: Date.now().toString(),
      text: newRule.trim(),
      author: currentUser.name,
      authorColor: currentUser.color,
      createdAt: new Date().toISOString()
    };
    const updatedSpace = { ...currentSpace, groundRules: [...currentSpace.groundRules, rule] };
    setSpaces(prev => ({ ...prev, [currentSpace.id]: updatedSpace }));
    setNewRule('');
  };

  const addHope = () => {
    if (!newHope.trim()) return;
    const hope = {
      id: Date.now().toString(),
      text: newHope.trim(),
      author: currentUser.name,
      authorColor: currentUser.color,
      createdAt: new Date().toISOString()
    };
    const updatedSpace = { ...currentSpace, hopes: [...currentSpace.hopes, hope] };
    setSpaces(prev => ({ ...prev, [currentSpace.id]: updatedSpace }));
    setNewHope('');
  };

  const addShare = () => {
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
    setEditName(currentUser.name);
    setEditColor(currentUser.color);
    setEditingProfile(true);
  };

  const saveProfile = () => {
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

  const cancelEdit = () => {
    setEditingProfile(false);
    setEditName('');
    setEditColor('');
  };

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
          <p className="text-gray-300 mb-4">Share this link with family members to invite them to your space</p>
          <div className="bg-gray-900 border border-yellow-500 p-4 rounded-lg mb-4 break-all text-sm text-yellow-400">{generateInviteLink()}</div>
          <div className="flex gap-2">
            <button onClick={copyInviteLink} className="flex-1 bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center justify-center gap-2">
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
            <button onClick={() => setShowInviteModal(false)} className="flex-1 bg-gray-800 text-yellow-500 border border-yellow-500 py-3 rounded-lg font-bold hover:bg-gray-700 transition">Close</button>
          </div>
        </div>
      </div>
    );
  }

  if (showSettings) {
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
              <MessageCircle className="w-4 h-4 inline mr-2" />Safe Share
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
                  <p className="text-sm text-gray-400">Safe Shares</p>
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
                    <p className="text-sm font-medium text-green-400 mb-2">Safe Shares ({currentSpace.shares.filter(s => s.author === currentUser.name).length})</p>
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
            <div className="mb-4">
              <textarea value={newRule} onChange={(e) => setNewRule(e.target.value)} placeholder="Add a ground rule for our space" className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 resize-none" rows="3" />
              <button onClick={addGroundRule} className="mt-2 w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">Add Rule</button>
            </div>
            <div className="space-y-3">
              {currentSpace.groundRules.map(rule => (
                <div key={rule.id} className="p-4 bg-gray-900 rounded-lg border-l-4" style={{ borderColor: rule.authorColor }}>
                  <p className="text-white mb-2">{rule.text}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: rule.authorColor }}>{rule.author.charAt(0).toUpperCase()}</div>
                    <span>{rule.author}</span>
                    <span>•</span>
                    <span>{new Date(rule.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {currentSpace.groundRules.length === 0 && (<p className="text-center text-gray-500 py-8">No ground rules yet. Be the first to add one.</p>)}
            </div>
          </div>
        )}

        {activeTab === 'hopes' && (
          <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-500 rounded-2xl shadow-2xl p-6">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Our Hopes</h2>
            <div className="mb-4">
              <textarea value={newHope} onChange={(e) => setNewHope(e.target.value)} placeholder="Share a hope for our family" className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 resize-none" rows="3" />
              <button onClick={addHope} className="mt-2 w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">Share Hope</button>
            </div>
            <div className="space-y-3">
              {currentSpace.hopes.map(hope => (
                <div key={hope.id} className="p-4 bg-gray-900 rounded-lg border-l-4" style={{ borderColor: hope.authorColor }}>
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
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Safe Share</h2>
            <div className="mb-4">
              <textarea value={newShare} onChange={(e) => setNewShare(e.target.value)} placeholder="Share something with the family" className="w-full px-4 py-3 bg-gray-900 border border-yellow-500 rounded-lg focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 resize-none" rows="3" />
              <button onClick={addShare} className="mt-2 w-full bg-yellow-500 text-black py-2 rounded-lg font-bold hover:bg-yellow-400">Share</button>
            </div>
            <div className="space-y-3">
              {currentSpace.shares.map(share => (
                <div key={share.id} className="p-4 bg-gray-900 rounded-lg border-l-4" style={{ borderColor: share.authorColor }}>
                  <p className="text-white mb-2">{share.text}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: share.authorColor }}>{share.author.charAt(0).toUpperCase()}</div>
                    <span>{share.author}</span>
                    <span>•</span>
                    <span>{new Date(share.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
              {currentSpace.shares.length === 0 && (<p className="text-center text-gray-500 py-8">No shares yet. Be the first to share.</p>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FamilyResetApp;