import React from 'react';
import { 
  ChevronRight, Plus, MoreVertical, Image as ImageIcon, 
  Link as LinkIcon, Video, Hash, AtSign, Smile, 
  RefreshCw, Trash2, Globe, Send, CheckCircle2, 
  UserPlus, ArrowRight, Bookmark, LayoutGrid, 
  Compass, MessageSquare, List, ShoppingBag, 
  FileText, PlayCircle, User, Heart, Share2,
  ThumbsDown, Layers
} from 'lucide-react';

const navItems = [
  { icon: <LayoutGrid size={18} />, label: 'All Feeds', count: 56, active: true },
  { icon: <Compass size={18} />, label: 'Explore' },
  { icon: <MessageSquare size={18} />, label: 'Messages' },
  { icon: <List size={18} />, label: 'Lists' },
  { icon: <Bookmark size={18} />, label: 'Bookmark' },
  { icon: <ShoppingBag size={18} />, label: 'Marketplace' },
  { icon: <FileText size={18} />, label: 'Files' },
  { icon: <PlayCircle size={18} />, label: 'Media' },
  { icon: <User size={18} />, label: 'Profile' },
];

const channels = [
  { color: 'bg-blue-600', icon: <div className="w-4 h-4 rounded-full border-2 border-white" /> },
  { color: 'bg-indigo-600', icon: <ChevronRight size={16} className="text-white" /> },
  { color: 'bg-emerald-500', icon: <div className="w-4 h-4 rounded-full border-2 border-white" /> },
  { color: 'bg-violet-600', icon: <span className="text-white font-bold text-[10px]">E</span> },
  { color: 'bg-red-500', icon: <div className="w-4 h-4 flex flex-col gap-0.5"><div className="h-1 bg-white/40 w-full"/><div className="h-1 bg-white w-full"/><div className="h-1 bg-white/40 w-full"/></div> },
  { color: 'bg-blue-500', icon: <span className="text-white font-bold text-[10px]">C</span> },
  { color: 'bg-yellow-400', icon: <div className="w-3 h-3 bg-black rounded-sm" /> },
  { color: 'bg-yellow-500', icon: <div className="w-4 h-4 bg-black rounded-full" /> },
];

const peoples = [
  { name: 'Anthony Lewis', location: 'United States', verified: true, avatar: 'https://picsum.photos/seed/s1/32/32' },
  { name: 'Harvey Smith', location: 'Ukrain', verified: false, avatar: 'https://picsum.photos/seed/s2/32/32' },
  { name: 'Stephan Peralt', location: 'Isreal', verified: false, avatar: 'https://picsum.photos/seed/s3/32/32' },
  { name: 'Doglas Martini', location: 'Belgium', verified: false, avatar: 'https://picsum.photos/seed/s4/32/32' },
  { name: 'Brian Villalobos', location: 'United Kingdom', verified: true, avatar: 'https://picsum.photos/seed/s5/32/32' },
  { name: 'Linda Ray', location: 'Argentina', verified: false, avatar: 'https://picsum.photos/seed/s6/32/32' },
];

export default function SocialFeedView() {
  return (
    <div className="flex flex-col h-full bg-gray-50/30">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold text-gray-800">Social Feed</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Applications</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Social Feed</span>
        </div>
      </div>

      <div className="flex gap-6 h-full overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-6 overflow-y-auto pr-1 pb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center text-center relative">
            <button className="absolute right-4 top-4 text-gray-300 hover:text-gray-600">
              <MoreVertical size={18} />
            </button>
            <div className="relative mb-4">
              <img src="https://picsum.photos/seed/james/80/80" alt="James" className="w-20 h-20 rounded-full border-4 border-white shadow-sm" referrerPolicy="no-referrer" />
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
            </div>
            <h3 className="font-bold text-gray-800 text-base">James Hong</h3>
            <p className="text-xs text-gray-400 font-medium">@James Hong324</p>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">
            <Plus size={18} /> Create Post
          </button>

          <nav className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-1">
            {navItems.map((item) => (
              <div key={item.label} className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${item.active ? 'bg-blue-50 text-blue-600 font-bold' : 'text-gray-500 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.count && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {item.count}
                  </span>
                )}
              </div>
            ))}
          </nav>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 mb-6">Pages You Liked</h4>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 flex flex-col gap-0.5">
                      <div className="h-1 bg-black w-full rotate-12 translate-y-1"/>
                      <div className="h-1 bg-black w-full -rotate-12 translate-y-1.5"/>
                      <div className="h-1 bg-black w-full rotate-12 translate-y-2"/>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-gray-800">Dribble</span>
                </div>
                <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                  <ThumbsDown size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Layers size={18} className="text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">UI/UX Designs</span>
                </div>
                <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                  <ThumbsDown size={14} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs italic">qb</span>
                  </div>
                  <span className="text-sm font-bold text-gray-800">Figma Update</span>
                </div>
                <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors">
                  <ThumbsDown size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Content (Feed) */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-12">
          {/* Create Post */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-4">Create Post</h3>
            <div className="relative mb-6">
              <textarea 
                placeholder="What's on your mind?" 
                className="w-full min-h-[100px] p-4 bg-gray-50/50 rounded-xl border border-gray-100 text-sm focus:outline-none focus:border-blue-200 resize-none"
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {[ImageIcon, LinkIcon, Video, Hash, AtSign, Smile].map((Icon, idx) => (
                  <button key={idx} className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-colors">
                    <Icon size={18} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-colors"><RefreshCw size={18} /></button>
                <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-colors"><Trash2 size={18} /></button>
                <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-gray-100 transition-colors"><Globe size={18} /></button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-bold shadow-md hover:bg-blue-700 transition-all">
                  <Send size={16} /> Share Post
                </button>
              </div>
            </div>
          </div>

          {/* Popular Channels */}
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-6">Popular Channels</h3>
            <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide">
              {channels.map((channel, i) => (
                <div key={i} className={`w-12 h-12 shrink-0 rounded-full ${channel.color} flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform`}>
                  {channel.icon}
                </div>
              ))}
            </div>
          </div>

          {/* Post Card 1: Sophie Headrick */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3">
                  <img src="https://picsum.photos/seed/sophie/48/48" alt="Sophie" className="w-12 h-12 rounded-xl" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-gray-800 text-sm">Sophie Headrick</h4>
                      <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-500 text-white" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <span className="text-blue-500">@sophie241</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>United Kingdom</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium">About 1 hr ago</span>
                  <button className="p-1.5 border border-gray-100 rounded-lg text-gray-300 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                Excited to announce the launch of our new product! Get yours now and enjoy a special discount.<span className="text-blue-500 cursor-pointer">#NewRelease</span> <span className="text-blue-500 cursor-pointer">#Innovation</span> 🎉
              </p>

              <div className="rounded-2xl overflow-hidden bg-purple-100 mb-0 relative">
                <img src="https://picsum.photos/seed/product-launch/800/400" alt="Post" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              
              <div className="p-4 border-x border-b border-gray-100 rounded-b-2xl mb-6">
                <h4 className="font-bold text-gray-800 text-sm mb-1">More Than Just Likes. It's About Meaningful Moments</h4>
                <p className="text-xs text-gray-400">PixSphere.com</p>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-50">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                    <Heart size={18} className="text-gray-400" />
                    <span>340K Likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                    <MessageSquare size={18} className="text-gray-400" />
                    <span>45 Comments</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                    <Share2 size={18} className="text-gray-400" />
                    <span>28 Share</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Heart size={18} className="text-red-500 fill-red-500" />
                  <Share2 size={18} className="text-gray-300" />
                  <MessageSquare size={18} className="text-gray-300" />
                  <Bookmark size={18} className="text-yellow-500 fill-yellow-500" />
                </div>
              </div>

              {/* Comment Section */}
              <div className="mt-4 space-y-4">
                <div className="flex gap-3">
                  <img src="https://picsum.photos/seed/frank/40/40" alt="Frank" className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                  <div className="flex-1 bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-bold text-gray-800 text-sm">Frank Hoffman</h5>
                      <span className="text-[10px] text-gray-400 font-medium">12:45 PM</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">
                      Congratulations on the launch! I've been eagerly waiting for this product, and the special discount makes it even more exciting.
                    </p>
                    <button className="flex items-center gap-1 text-[10px] font-bold text-gray-600 hover:text-blue-600">
                      <Share2 size={12} className="rotate-180" /> Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Post Card 2: Richard Smith */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-3">
                  <img src="https://picsum.photos/seed/richard/48/48" alt="Richard" className="w-12 h-12 rounded-xl" referrerPolicy="no-referrer" />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-gray-800 text-sm">Richard Smith</h4>
                      <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-500 text-white" />
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                      <span className="text-blue-500">@richard442</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>United Kingdom</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium">About 1 hr ago</span>
                  <button className="p-1.5 border border-gray-100 rounded-lg text-gray-300 hover:text-gray-600">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6">
                "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle. <span className="text-blue-500 cursor-pointer">#MotivationMonday</span><span className="text-blue-500 cursor-pointer">#Inspiration</span> 🌟"
              </p>

              <div className="rounded-2xl overflow-hidden bg-orange-100 aspect-video relative">
                <img src="https://picsum.photos/seed/post/800/450" alt="Post" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-72 shrink-0 flex flex-col gap-6 overflow-y-auto pr-1 pb-12">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-6">Peoples</h3>
            <div className="space-y-5 mb-6">
              {peoples.map((person, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3">
                    <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full" referrerPolicy="no-referrer" />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-gray-800 text-xs">{person.name}</h4>
                        {person.verified && <CheckCircle2 size={12} className="text-emerald-500 fill-emerald-500 text-white" />}
                      </div>
                      <p className="text-[10px] text-gray-400 font-medium">{person.location}</p>
                    </div>
                  </div>
                  <button className="p-2 bg-gray-50 text-gray-400 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                    <UserPlus size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button className="w-full py-2.5 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-6">Saved Feeds</h3>
            <div className="space-y-4 mb-6">
              {/* World Health */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
                    </div>
                    <h4 className="font-bold text-gray-800 text-xs">World Health</h4>
                  </div>
                  <Bookmark size={16} className="text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                  Retail investor party continues even as
                </p>
              </div>

              {/* T3 Tech */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-[10px]">T3</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-xs">T3 Tech</h4>
                  </div>
                  <Bookmark size={16} className="text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                  Ipad Air (2020) vs Samsung Galaxy Tab
                </p>
              </div>

              {/* Fstoppers */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-[10px]">E</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-xs">Fstoppers</h4>
                  </div>
                  <Bookmark size={16} className="text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                  Beyond capital gains tax! Top 50 stock
                </p>
              </div>

              {/* Evernote */}
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-[10px]">G</span>
                    </div>
                    <h4 className="font-bold text-gray-800 text-xs">Evernote</h4>
                  </div>
                  <Bookmark size={16} className="text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                  Sony Just Destroyed the Competition
                </p>
              </div>
            </div>
            <button className="w-full py-2.5 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
              View All <ArrowRight size={14} />
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-base font-bold text-gray-800 mb-6">Trending Hashtags</h3>
            <div className="flex flex-wrap gap-x-3 gap-y-2">
              {['#HealthTips', '#Wellness', '#Motivation', '#Inspiration'].map((tag) => (
                <span key={tag} className="text-sm font-medium text-blue-500 cursor-pointer hover:underline">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="rounded-xl overflow-hidden mb-4 aspect-[4/3]">
              <img 
                src="https://picsum.photos/seed/upgrade/400/300" 
                alt="Upgrade" 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
            </div>
            <h4 className="text-sm font-bold text-gray-800 text-center mb-6 leading-relaxed">
              Enjoy Unlimited Access on a small price monthly.
            </h4>
            <button className="w-full py-2.5 border border-gray-100 rounded-xl text-xs font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
              Upgrade Now <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
