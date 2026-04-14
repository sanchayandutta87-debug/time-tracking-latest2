import React from 'react';
import { ChevronRight, Home, ChevronsRight, ArrowRight, Slash, MoreHorizontal, Settings, User, Folder } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, separator = <ChevronRight size={14} />, className = '' }) => {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        {items.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            {index !== 0 && (
              <span className="mx-2 text-gray-400 flex items-center justify-center">
                {separator}
              </span>
            )}
            {item.active ? (
              <span className="text-sm font-medium text-gray-500 flex items-center gap-1.5">
                {item.icon}
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || '#'}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors gap-1.5"
              >
                {item.icon}
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default function BreadcrumbView() {
  const basicItems = [
    { label: 'Home', href: '#' },
    { label: 'Library', href: '#' },
    { label: 'Data', active: true },
  ];

  const iconItems = [
    { label: 'Home', href: '#', icon: <Home size={14} /> },
    { label: 'Library', href: '#', icon: <Folder size={14} /> },
    { label: 'Data', active: true, icon: <Settings size={14} /> },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Breadcrumb</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Home size={14} />
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Base UI</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Breadcrumb</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Default Breadcrumb */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Default Breadcrumb</h2>
          </div>
          <div className="p-6 space-y-4">
            <Breadcrumb items={[{ label: 'Home', active: true }]} />
            <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Library', active: true }]} />
            <Breadcrumb items={basicItems} />
          </div>
        </div>

        {/* Breadcrumb with Icons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Breadcrumb with Icons</h2>
          </div>
          <div className="p-6 space-y-4">
            <Breadcrumb items={[{ label: 'Home', active: true, icon: <Home size={14} /> }]} />
            <Breadcrumb items={[{ label: 'Home', href: '#', icon: <Home size={14} /> }, { label: 'Library', active: true }]} />
            <Breadcrumb items={iconItems} />
          </div>
        </div>

        {/* Arrow Style */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Arrow Style</h2>
          </div>
          <div className="p-6 space-y-4">
            <Breadcrumb items={[{ label: 'Home', active: true }]} separator={<ChevronsRight size={14} />} />
            <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Library', active: true }]} separator={<ChevronsRight size={14} />} />
            <Breadcrumb items={basicItems} separator={<ChevronsRight size={14} />} />
          </div>
        </div>

        {/* Pipe Style */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Pipe Style</h2>
          </div>
          <div className="p-6 space-y-4">
            <Breadcrumb items={[{ label: 'Home', active: true }]} separator={<ArrowRight size={14} />} />
            <Breadcrumb items={[{ label: 'Home', href: '#' }, { label: 'Library', active: true }]} separator={<ArrowRight size={14} />} />
            <Breadcrumb items={basicItems} separator={<ArrowRight size={14} />} />
          </div>
        </div>

        {/* Divider Variants */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Divider Variants</h2>
          </div>
          <div className="p-6 space-y-4">
            <Breadcrumb items={basicItems} separator={<Slash size={14} className="rotate-[20deg]" />} />
            <Breadcrumb items={basicItems} separator={<span className="text-gray-300 font-bold">|</span>} />
            <Breadcrumb items={basicItems} separator={<span className="text-gray-300 font-bold">•</span>} />
            <Breadcrumb items={basicItems} separator={<ArrowRight size={14} />} />
          </div>
        </div>

        {/* Background Styles */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Background Styles</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <Breadcrumb items={basicItems} />
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <Breadcrumb items={basicItems} className="text-blue-600" />
            </div>
            <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
              <Breadcrumb 
                items={[
                  { label: 'Home', href: '#' },
                  { label: 'Library', href: '#' },
                  { label: 'Data', active: true },
                ].map(item => ({ ...item, className: item.active ? 'text-gray-400' : 'text-white hover:text-blue-400' }))} 
                className="text-white"
              />
            </div>
          </div>
        </div>

        {/* Collapsed Breadcrumb */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Collapsed Breadcrumb</h2>
          </div>
          <div className="p-6">
            <Breadcrumb 
              items={[
                { label: 'Home', href: '#', icon: <Home size={14} /> },
                { label: '...', href: '#', icon: <MoreHorizontal size={14} /> },
                { label: 'Components', href: '#' },
                { label: 'Base UI', href: '#' },
                { label: 'Breadcrumb', active: true },
              ]} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
