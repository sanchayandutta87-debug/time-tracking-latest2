import React from 'react';
import { ChevronRight, Copy, Apple } from 'lucide-react';

const WindowsIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#00a4ef">
    <path d="M0 3.449L9.75 2.1V11.4H0V3.449zm0 8.851h9.75v9.3L0 20.25v-7.95zM10.65 1.95L24 0v11.4h-13.35V1.95zm0 12.9h13.35V24l-13.35-1.95V14.85z" />
  </svg>
);

const MacOSIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#000000">
    <path d="M17.057 12.767c.026 2.687 2.334 3.581 2.36 3.597-.02.067-.37 1.266-1.217 2.503-.732 1.07-1.492 2.136-2.689 2.158-1.175.022-1.553-.7-2.897-.7-1.344 0-1.763.678-2.876.722-1.113.044-1.991-1.136-2.729-2.203-1.508-2.182-2.66-6.152-1.11-8.84 1.154-1.994 3.204-3.253 5.431-3.286 1.69-.025 3.284 1.142 4.319 1.142 1.036 0 2.964-1.388 4.981-1.183 1.036.044 3.946.418 5.815 3.154l-.125.078c-1.573.977-2.327 2.323-2.327 4.04zM15.53 3.33c.915-1.11 1.53-2.654 1.362-4.197-1.327.053-2.934.883-3.885 1.993-.854.99-1.6 2.556-1.4 4.047 1.478.115 2.98-.71 3.923-1.843z" />
  </svg>
);

const LinuxIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#000000">
    <path d="M12.001 0c-2.321 0-4.202 1.881-4.202 4.202 0 .524.096 1.025.271 1.488-1.637.769-2.771 2.433-2.771 4.364 0 1.25.474 2.387 1.25 3.243-.375.632-.591 1.369-.591 2.157 0 2.321 1.881 4.202 4.202 4.202.788 0 1.525-.216 2.157-.591.856.776 1.993 1.25 3.243 1.25 1.931 0 3.595-1.134 4.364-2.771.463.175.964.271 1.488.271 2.321 0 4.202-1.881 4.202-4.202 0-2.321-1.881-4.202-4.202-4.202-.524 0-1.025.096-1.488.271-.769-1.637-2.433-2.771-4.364-2.771-1.25 0-2.387.474-3.243 1.25-.632-.375-1.369-.591-2.157-.591-2.321 0-4.202 1.881-4.202 4.202 0 .788.216 1.525.591 2.157-.776.856-1.25 1.993-1.25 3.243 0 1.931 1.134 3.595 2.771 4.364-.175.463-.271.964-.271 1.488 0 2.321 1.881 4.202 4.202 4.202s4.202-1.881 4.202-4.202c0-.524-.096-1.025-.271-1.488 1.637-.769 2.771-2.433 2.771-4.364 0-1.25-.474-2.387-1.25-3.243.375-.632.591-1.369.591-2.157 0-2.321-1.881-4.202-4.202-4.202-.788 0-1.525.216-2.157.591-.856-.776-1.993-1.25-3.243-1.25z" />
  </svg>
);

const AndroidIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#3DDC84">
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9997.9993-.9997.5511 0 .9993.4486.9993.9997 0 .5511-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997 0-.5511.4482-.9997.9993-.9997.5511 0 .9993.4486.9993.9997 0 .5511-.4482.9997-.9993.9997m11.4045-6.0206l1.9973-3.4592c.115-.1992.0468-.4539-.1523-.5689-.1992-.115-.4539-.0468-.5689.1523l-2.022 3.5019c-1.5583-.7116-3.2925-1.1118-5.1356-1.1118-1.8431 0-3.5773.4002-5.1356 1.1118l-2.022-3.5019c-.115-.1992-.3697-.2673-.5689-.1523-.1992.115-.2673.3697-.1523.5689l1.9973 3.4592c-3.1491 1.7111-5.3114 4.8876-5.611 8.61h17.222c-.2996-3.7224-2.4619-6.8989-5.611-8.61" />
  </svg>
);

const IosIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="#000000">
    <path d="M17.057 12.767c.026 2.687 2.334 3.581 2.36 3.597-.02.067-.37 1.266-1.217 2.503-.732 1.07-1.492 2.136-2.689 2.158-1.175.022-1.553-.7-2.897-.7-1.344 0-1.763.678-2.876.722-1.113.044-1.991-1.136-2.729-2.203-1.508-2.182-2.66-6.152-1.11-8.84 1.154-1.994 3.204-3.253 5.431-3.286 1.69-.025 3.284 1.142 4.319 1.142 1.036 0 2.964-1.388 4.981-1.183 1.036.044 3.946.418 5.815 3.154l-.125.078c-1.573.977-2.327 2.323-2.327 4.04zM15.53 3.33c.915-1.11 1.53-2.654 1.362-4.197-1.327.053-2.934.883-3.885 1.993-.854.99-1.6 2.556-1.4 4.047 1.478.115 2.98-.71 3.923-1.843z" />
  </svg>
);

export default function DownloadView() {
  return (
    <div className="p-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Download</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className="hover:text-blue-600 cursor-pointer">Home</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Download</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-12">
        
        {/* Desktop Section */}
        <div className="bg-gray-50/50 rounded-2xl p-8 mb-8 border border-gray-50">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Download and install on all employee's computers.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center gap-4 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <WindowsIcon />
              <span className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">Windows</span>
            </button>
            <button className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center gap-4 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <div className="w-10 h-10 bg-cyan-400 rounded-lg flex items-center justify-center p-1.5">
                <MacOSIcon />
              </div>
              <span className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">MacOS</span>
            </button>
            <button className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center gap-4 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" alt="Linux" className="w-10 h-10" referrerPolicy="no-referrer" />
              <span className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">Linux</span>
            </button>
          </div>
        </div>

        {/* Mobile Section */}
        <div className="bg-gray-50/50 rounded-2xl p-8 mb-12 border border-gray-50">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Instructions how to install it on employee's computers & Mobile.</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center gap-4 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <AndroidIcon />
              <span className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">Android</span>
            </button>
            <button className="bg-white border border-gray-100 rounded-2xl p-8 flex flex-col items-center gap-4 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <IosIcon />
              <span className="text-lg font-black text-gray-900 group-hover:text-blue-600 transition-colors">Ios</span>
            </button>
          </div>
        </div>

        {/* OR Separator */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* URL Section */}
        <div className="mb-8">
          <div className="flex border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <input 
              type="text" 
              readOnly 
              value="https://www.dreamstimer.com" 
              className="flex-1 px-4 py-3 text-sm text-gray-600 bg-white outline-none"
            />
            <button className="bg-blue-600 text-white px-6 py-3 text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
               Copy URL
            </button>
          </div>
          <p className="text-xs font-bold text-gray-400 mt-3">Copy installation URL and send it to system administrator or employees</p>
        </div>

        {/* Info Box */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-6">
          <p className="text-sm font-medium text-gray-600 leading-relaxed">
            Employees will show up on your dashboard automatically after the installation, no other signups are required.
          </p>
        </div>

      </div>
    </div>
  );
}
