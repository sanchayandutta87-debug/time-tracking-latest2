import React, { useState } from 'react';
import { ChevronRight, Home, ChevronDown, ChevronUp, ChevronLeft, Mail, Bell, Edit, Trash2, Settings, User, Search, Loader2 } from 'lucide-react';

interface ButtonGroupProps {
  children: React.ReactNode;
  vertical?: boolean;
  className?: string;
  justified?: boolean;
}

const ButtonGroup: React.FC<ButtonGroupProps> = ({ children, vertical = false, className = '', justified = false }) => {
  return (
    <div className={`${justified ? 'flex' : 'inline-flex'} ${vertical ? 'flex-col' : 'flex-row'} rounded-lg shadow-sm ${className}`} role="group">
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;

        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;

        let borderClasses = '';
        if (vertical) {
          borderClasses = `${!isLast ? 'border-b-0' : ''} ${isFirst ? 'rounded-t-lg rounded-b-none' : ''} ${isLast ? 'rounded-b-lg rounded-t-none' : ''} ${!isFirst && !isLast ? 'rounded-none' : ''}`;
        } else {
          borderClasses = `${!isLast ? 'border-r-0' : ''} ${isFirst ? 'rounded-l-lg rounded-r-none' : ''} ${isLast ? 'rounded-r-lg rounded-l-none' : ''} ${!isFirst && !isLast ? 'rounded-none' : ''}`;
        }

        return React.cloneElement(child as React.ReactElement<any>, {
          className: `${child.props.className || ''} ${borderClasses} ${justified ? 'flex-1' : ''}`.trim(),
        });
      })}
    </div>
  );
};

export default function ButtonGroupView() {
  const [activeRadio, setActiveRadio] = useState('Radio 1');
  const [activeChecks, setActiveChecks] = useState<string[]>(['Checkbox 1']);
  const [activeSegment, setActiveSegment] = useState('Monthly');

  const toggleCheck = (val: string) => {
    setActiveChecks(prev => 
      prev.includes(val) ? prev.filter(i => i !== val) : [...prev, val]
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Button Group</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Home size={14} />
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Base UI</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Button Group</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Button Group */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Basic Button Group</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Left</button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Middle</button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Right</button>
            </ButtonGroup>
          </div>
        </div>

        {/* Outline Button Group */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Outline Button Group</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              <button className="px-4 py-2 bg-white text-blue-600 text-sm font-bold hover:bg-blue-50 border border-blue-600">Left</button>
              <button className="px-4 py-2 bg-white text-blue-600 text-sm font-bold hover:bg-blue-50 border border-blue-600">Middle</button>
              <button className="px-4 py-2 bg-white text-blue-600 text-sm font-bold hover:bg-blue-50 border border-blue-600">Right</button>
            </ButtonGroup>
          </div>
        </div>

        {/* Split Button Groups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Split Button Groups</h2>
          </div>
          <div className="p-6 space-y-4">
            <ButtonGroup>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Primary Action</button>
              <div className="relative group">
                <button className="px-2 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600 rounded-r-lg">
                  <ChevronDown size={18} />
                </button>
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Action 1</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Action 2</a>
                </div>
              </div>
            </ButtonGroup>
            <br />
            <ButtonGroup>
              <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 border border-emerald-600">Success Action</button>
              <div className="relative group">
                <button className="px-2 py-2 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 border border-emerald-600 rounded-r-lg">
                  <ChevronDown size={18} />
                </button>
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Action 1</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Action 2</a>
                </div>
              </div>
            </ButtonGroup>
          </div>
        </div>

        {/* Justified Button Groups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Justified Button Groups</h2>
          </div>
          <div className="p-6">
            <ButtonGroup justified className="w-full">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Left</button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Middle</button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Right</button>
            </ButtonGroup>
            <p className="mt-4 text-xs text-gray-400 italic">* Spans the full width of the container</p>
          </div>
        </div>

        {/* Mixed Styles */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Mixed Styles</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              <button className="px-4 py-2 bg-red-600 text-white text-sm font-bold hover:bg-red-700 border border-red-600">Left</button>
              <button className="px-4 py-2 bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 border border-amber-500">Middle</button>
              <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 border border-emerald-600">Right</button>
            </ButtonGroup>
          </div>
        </div>

        {/* Nesting */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Nesting</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">1</button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">2</button>
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600 rounded-r-lg">
                  Dropdown <ChevronDown size={14} />
                </button>
                <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dropdown link</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Dropdown link</a>
                </div>
              </div>
            </ButtonGroup>
          </div>
        </div>

        {/* Checkbox Button Groups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Checkbox Button Groups</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              {['Checkbox 1', 'Checkbox 2', 'Checkbox 3'].map(val => (
                <button
                  key={val}
                  onClick={() => toggleCheck(val)}
                  className={`px-4 py-2 text-sm font-bold border transition-colors ${
                    activeChecks.includes(val) 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </ButtonGroup>
          </div>
        </div>

        {/* Radio Button Groups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Radio Button Groups</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              {['Radio 1', 'Radio 2', 'Radio 3'].map(val => (
                <button
                  key={val}
                  onClick={() => setActiveRadio(val)}
                  className={`px-4 py-2 text-sm font-bold border transition-colors ${
                    activeRadio === val 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </ButtonGroup>
          </div>
        </div>

        {/* Segmented Control (Pill Style) */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Segmented Control</h2>
          </div>
          <div className="p-6">
            <div className="inline-flex p-1 bg-gray-100 rounded-full">
              {['Daily', 'Weekly', 'Monthly'].map(val => (
                <button
                  key={val}
                  onClick={() => setActiveSegment(val)}
                  className={`px-6 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                    activeSegment === val 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Button Groups with Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Button Groups with Badges</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">
                Messages <span className="px-1.5 py-0.5 bg-white text-blue-600 text-[10px] rounded-full">12</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">
                Notifications <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">5</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">
                Updates <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[10px] rounded-full">3</span>
              </button>
            </ButtonGroup>
          </div>
        </div>

        {/* Disabled States */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Disabled States</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Active</button>
              <button disabled className="px-4 py-2 bg-blue-600 text-white text-sm font-bold opacity-50 cursor-not-allowed border border-blue-600">Disabled</button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Active</button>
            </ButtonGroup>
          </div>
        </div>

        {/* Loading States */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Loading States</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Normal</button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">
                <Loader2 size={14} className="animate-spin" /> Loading
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Normal</button>
            </ButtonGroup>
          </div>
        </div>

        {/* Sizing */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Sizing</h2>
          </div>
          <div className="p-6 space-y-6">
            <ButtonGroup>
              <button className="px-6 py-3 bg-blue-600 text-white text-lg font-bold hover:bg-blue-700 border border-blue-600">Left</button>
              <button className="px-6 py-3 bg-blue-600 text-white text-lg font-bold hover:bg-blue-700 border border-blue-600">Middle</button>
              <button className="px-6 py-3 bg-blue-600 text-white text-lg font-bold hover:bg-blue-700 border border-blue-600">Right</button>
            </ButtonGroup>
            <br />
            <ButtonGroup>
              <button className="px-4 py-2 bg-gray-600 text-white text-sm font-bold hover:bg-gray-700 border border-gray-600">Left</button>
              <button className="px-4 py-2 bg-gray-600 text-white text-sm font-bold hover:bg-gray-700 border border-gray-600">Middle</button>
              <button className="px-4 py-2 bg-gray-600 text-white text-sm font-bold hover:bg-gray-700 border border-gray-600">Right</button>
            </ButtonGroup>
            <br />
            <ButtonGroup>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200 border border-gray-200">Left</button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200 border border-gray-200">Middle</button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200 border border-gray-200">Right</button>
            </ButtonGroup>
          </div>
        </div>

        {/* Button Toolbar */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Button Toolbar</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap gap-4">
              <ButtonGroup>
                {[1, 2, 3, 4].map(n => (
                  <button key={n} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">{n}</button>
                ))}
              </ButtonGroup>
              <ButtonGroup>
                {[5, 6, 7].map(n => (
                  <button key={n} className="px-4 py-2 bg-gray-600 text-white text-sm font-bold hover:bg-gray-700 border border-gray-600">{n}</button>
                ))}
              </ButtonGroup>
              <ButtonGroup>
                <button className="px-4 py-2 bg-blue-500 text-white text-sm font-bold hover:bg-blue-600 border border-blue-500">8</button>
              </ButtonGroup>
            </div>

            <div className="flex flex-wrap gap-4">
              <ButtonGroup>
                {[1, 2, 3, 4].map(n => (
                  <button key={n} className="px-4 py-2 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 border border-gray-300">{n}</button>
                ))}
              </ButtonGroup>
              <div className="flex items-center">
                <div className="flex items-center px-3 py-2 bg-gray-50 border border-gray-300 border-r-0 rounded-l-lg text-gray-500">
                  <span className="text-sm">@</span>
                </div>
                <input 
                  type="text" 
                  placeholder="Input group example" 
                  className="px-4 py-2 border border-gray-300 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <ButtonGroup>
              {[1, 2, 3, 4].map(n => (
                <button key={n} className="px-4 py-2 bg-white text-gray-600 text-sm font-bold hover:bg-gray-50 border border-gray-300">{n}</button>
              ))}
            </ButtonGroup>
          </div>
        </div>

        {/* Vertical */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Vertical</h2>
          </div>
          <div className="p-6 flex flex-wrap gap-12">
            <ButtonGroup vertical className="w-40">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Button</button>
              <button className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">
                Dropdown <ChevronDown size={14} />
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">
                <ChevronLeft size={14} /> Dropdown
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">
                Dropdown <ChevronRight size={14} />
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">
                Dropdown <ChevronUp size={14} />
              </button>
            </ButtonGroup>

            <ButtonGroup vertical className="w-28">
              {[1, 2, 3, 4].map(n => (
                <button key={n} className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600">Button</button>
              ))}
            </ButtonGroup>

            <ButtonGroup vertical className="w-32">
              {['Radio 1', 'Radio 2', 'Radio 3'].map(val => (
                <button
                  key={val}
                  onClick={() => setActiveRadio(val)}
                  className={`px-4 py-2 text-sm font-bold border transition-colors ${
                    activeRadio === val 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'bg-white text-blue-600 border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  {val}
                </button>
              ))}
            </ButtonGroup>
          </div>
        </div>

        {/* Responsive Button Groups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Responsive Button Groups</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row rounded-lg shadow-sm" role="group">
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600 rounded-t-lg sm:rounded-t-none sm:rounded-l-lg border-b-0 sm:border-b sm:border-r-0">Desktop Horizontal</button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600 border-b-0 sm:border-b sm:border-r-0">Mobile Vertical</button>
              <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 border border-blue-600 rounded-b-lg sm:rounded-b-none sm:rounded-r-lg">Switching Layout</button>
            </div>
            <p className="mt-4 text-xs text-gray-400 italic">* Stacks vertically on mobile, horizontal on desktop</p>
          </div>
        </div>

        {/* Icon Button Groups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Icon Button Groups</h2>
          </div>
          <div className="p-6 space-y-4">
            <ButtonGroup>
              <button className="p-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"><Mail size={18} /></button>
              <button className="p-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"><Bell size={18} /></button>
              <button className="p-2 bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"><Settings size={18} /></button>
            </ButtonGroup>
            <br />
            <ButtonGroup>
              <button className="p-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"><Edit size={18} /></button>
              <button className="p-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"><Trash2 size={18} /></button>
              <button className="p-2 bg-blue-600 text-white border border-blue-600 hover:bg-blue-700"><User size={18} /></button>
            </ButtonGroup>
          </div>
        </div>

        {/* Soft Button Groups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Soft Button Groups</h2>
          </div>
          <div className="p-6">
            <ButtonGroup>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 border border-blue-100">Left</button>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 border border-blue-100">Middle</button>
              <button className="px-4 py-2 bg-blue-50 text-blue-600 text-sm font-bold hover:bg-blue-100 border border-blue-100">Right</button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    </div>
  );
}
