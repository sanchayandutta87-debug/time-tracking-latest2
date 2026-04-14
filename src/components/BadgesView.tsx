import React from 'react';
import { ChevronRight, Home, Bell, Mail, User, Menu, Check, X, Star, Info, AlertCircle, ExternalLink } from 'lucide-react';

interface BadgeProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'orange' | 'purple';
  type?: 'default' | 'soft' | 'outline' | 'soft-border' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  square?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  href?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  variant = 'primary', 
  type = 'default', 
  size = 'md',
  rounded = false, 
  square = false,
  pulse = false,
  icon,
  children, 
  className = '',
  href
}) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  const roundedClass = square ? 'rounded-none' : rounded ? 'rounded-full' : 'rounded';
  const baseClasses = `inline-flex items-center gap-1 font-bold transition-all duration-200 ${sizeClasses[size]} ${roundedClass}`;
  
  const variants = {
    primary: {
      default: 'bg-blue-600 text-white',
      soft: 'bg-blue-50 text-blue-600',
      outline: 'border border-blue-600 text-blue-600',
      'soft-border': 'bg-blue-50 border border-blue-200 text-blue-600',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-sm',
    },
    secondary: {
      default: 'bg-gray-600 text-white',
      soft: 'bg-gray-50 text-gray-600',
      outline: 'border border-gray-600 text-gray-600',
      'soft-border': 'bg-gray-50 border border-gray-200 text-gray-600',
      gradient: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white shadow-sm',
    },
    success: {
      default: 'bg-emerald-600 text-white',
      soft: 'bg-emerald-50 text-emerald-600',
      outline: 'border border-emerald-600 text-emerald-600',
      'soft-border': 'bg-emerald-50 border border-emerald-200 text-emerald-600',
      gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white shadow-sm',
    },
    danger: {
      default: 'bg-red-600 text-white',
      soft: 'bg-red-50 text-red-600',
      outline: 'border border-red-600 text-red-600',
      'soft-border': 'bg-red-50 border border-red-200 text-red-600',
      gradient: 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-sm',
    },
    warning: {
      default: 'bg-amber-500 text-white',
      soft: 'bg-amber-50 text-amber-600',
      outline: 'border border-amber-500 text-amber-600',
      'soft-border': 'bg-amber-50 border border-amber-200 text-amber-600',
      gradient: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white shadow-sm',
    },
    info: {
      default: 'bg-cyan-500 text-white',
      soft: 'bg-cyan-50 text-cyan-600',
      outline: 'border border-cyan-500 text-cyan-600',
      'soft-border': 'bg-cyan-50 border border-cyan-200 text-cyan-600',
      gradient: 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white shadow-sm',
    },
    light: {
      default: 'bg-white border border-gray-200 text-gray-800',
      soft: 'bg-gray-50 text-gray-400',
      outline: 'border border-gray-200 text-gray-400',
      'soft-border': 'bg-white border border-gray-100 text-gray-400',
      gradient: 'bg-gradient-to-r from-gray-50 to-gray-100 text-gray-600 shadow-sm',
    },
    dark: {
      default: 'bg-gray-900 text-white',
      soft: 'bg-gray-100 text-gray-800',
      outline: 'border border-gray-900 text-gray-900',
      'soft-border': 'bg-gray-100 border border-gray-300 text-gray-800',
      gradient: 'bg-gradient-to-r from-gray-800 to-black text-white shadow-sm',
    },
    orange: {
      default: 'bg-orange-500 text-white',
      soft: 'bg-orange-50 text-orange-600',
      outline: 'border border-orange-500 text-orange-600',
      'soft-border': 'bg-orange-50 border border-orange-200 text-orange-600',
      gradient: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-sm',
    },
    purple: {
      default: 'bg-purple-500 text-white',
      soft: 'bg-purple-50 text-purple-600',
      outline: 'border border-purple-500 text-purple-600',
      'soft-border': 'bg-purple-50 border border-purple-200 text-purple-600',
      gradient: 'bg-gradient-to-r from-purple-400 to-purple-600 text-white shadow-sm',
    }
  };

  const pulseColors = {
    primary: 'bg-blue-400',
    secondary: 'bg-gray-400',
    success: 'bg-emerald-400',
    danger: 'bg-red-400',
    warning: 'bg-amber-400',
    info: 'bg-cyan-400',
    light: 'bg-gray-200',
    dark: 'bg-gray-600',
    orange: 'bg-orange-400',
    purple: 'bg-purple-400',
  };

  const content = (
    <>
      {pulse && (
        <span className="relative flex h-2 w-2 mr-1">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${pulseColors[variant]} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-2 w-2 ${pulseColors[variant].replace('-400', '-600')}`}></span>
        </span>
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={`${baseClasses} ${variants[variant][type]} hover:opacity-80 cursor-pointer ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <span className={`${baseClasses} ${variants[variant][type]} ${className}`}>
      {content}
    </span>
  );
};

export default function BadgesView() {
  const variants: BadgeProps['variant'][] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'];
  const gradientVariants: BadgeProps['variant'][] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'orange', 'purple'];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Badges</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Home size={14} />
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Base UI</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Badges</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Default Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Default Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the badge class to show a default badge.</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <Badge key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Rounded Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Rounded Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the <code className="text-pink-500 bg-pink-50 px-1 rounded">.rounded-pill</code> to create a soft badge more rounded.</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <Badge key={v} variant={v} rounded>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Soft Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the <code className="text-pink-500 bg-pink-50 px-1 rounded">badge-soft-</code> class to create a softer badge.</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <Badge key={v} variant={v} type="soft">{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Rounded Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Soft Rounded Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the <code className="text-pink-500 bg-pink-50 px-1 rounded">rounded-pill badge-soft-</code> to create a soft badge more rounded.</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <Badge key={v} variant={v} type="soft" rounded>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Outline Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Outline Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the <code className="text-pink-500 bg-pink-50 px-1 rounded">badge-outline-</code> to create a badge with the outline.</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <Badge key={v} variant={v} type="outline">{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Outline Rounded Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Outline Rounded Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the <code className="text-pink-500 bg-pink-50 px-1 rounded">rounded-pill badge-outline-</code> class to create a outline pill badge.</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <Badge key={v} variant={v} type="outline" rounded>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Border Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Soft Border Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the <code className="text-pink-500 bg-pink-50 px-1 rounded">badge-border</code> and <code className="text-pink-500 bg-pink-50 px-1 rounded">badge-soft-</code> with below mentioned modifier classes to make badges with border & soft background.</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <Badge key={v} variant={v} type="soft-border">{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Border Rounded Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Soft Border Rounded Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the <code className="text-pink-500 bg-pink-50 px-1 rounded">badge-border</code> and <code className="text-pink-500 bg-pink-50 px-1 rounded">badge-soft-</code> with below mentioned modifier classes to make badges with border & soft background.</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => (
                <Badge key={v} variant={v} type="soft-border" rounded>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Gradient Badges</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {gradientVariants.map(v => (
                <Badge key={v} variant={v} type="gradient">{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient Pill Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Gradient Pill Badges</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-2">
              {gradientVariants.map(v => (
                <Badge key={v} variant={v} type="gradient" rounded>{v.charAt(0).toUpperCase() + v.slice(1)}</Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Link Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Link Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Badges that act as links with hover effects.</p>
            <div className="flex flex-wrap gap-2">
              <Badge href="#" variant="primary">Primary Link</Badge>
              <Badge href="#" variant="success" rounded>Success Link</Badge>
              <Badge href="#" variant="danger" type="soft">Danger Soft Link</Badge>
              <Badge href="#" variant="info" type="outline">Info Outline Link</Badge>
            </div>
          </div>
        </div>

        {/* Badges with Icons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Badges with Icons</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Badges with icons for better visual representation.</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="success" icon={<Check size={12} />}>Success</Badge>
              <Badge variant="danger" icon={<X size={12} />}>Error</Badge>
              <Badge variant="warning" icon={<AlertCircle size={12} />}>Warning</Badge>
              <Badge variant="info" icon={<Info size={12} />}>Info</Badge>
              <Badge variant="primary" icon={<Star size={12} />}>Featured</Badge>
              <Badge variant="dark" icon={<ExternalLink size={12} />}>External</Badge>
            </div>
          </div>
        </div>

        {/* Badge Sizing */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Badge Sizing</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Different sizes for badges.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Badge size="sm">Small Badge</Badge>
              <Badge size="md">Medium Badge</Badge>
              <Badge size="lg">Large Badge</Badge>
            </div>
          </div>
        </div>

        {/* Square Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Square Badges</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Badges with no border radius.</p>
            <div className="flex flex-wrap gap-2">
              <Badge square variant="primary">Primary</Badge>
              <Badge square variant="success">Success</Badge>
              <Badge square variant="danger">Danger</Badge>
              <Badge square variant="warning">Warning</Badge>
            </div>
          </div>
        </div>

        {/* Shadow Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Shadow Badges</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <Badge variant="primary" className="shadow-md">Shadow MD</Badge>
              <Badge variant="success" className="shadow-lg">Shadow LG</Badge>
              <Badge variant="danger" className="shadow-xl">Shadow XL</Badge>
              <Badge variant="info" className="shadow-blue-200 shadow-lg">Colored Shadow</Badge>
            </div>
          </div>
        </div>

        {/* Animated Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Animated Badges</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <Badge variant="success" pulse>Live</Badge>
              <Badge variant="danger" pulse>Recording</Badge>
              <Badge variant="info" pulse>Streaming</Badge>
              <Badge variant="warning" pulse>Processing</Badge>
            </div>
          </div>
        </div>

        {/* Badge Usage */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Badge Usage</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-6">
              <button className="relative px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                Inbox
                <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-[10px] px-1.5 py-0.5 rounded-full border-2 border-white">99+</span>
              </button>
              
              <button className="relative px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                Profile
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span>
              </button>

              <button className="relative p-2 bg-blue-600 text-white rounded-lg">
                <ChevronRight size={18} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span>
              </button>

              <button className="relative p-2 bg-gray-100 text-gray-600 rounded-full">
                <Bell size={18} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span>
              </button>

              <button className="relative p-2 bg-gray-100 text-gray-600 rounded-full">
                <Menu size={18} />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </div>

        {/* Buttons With Badges */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Buttons With Badges</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <button className="flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold">
                Notifications
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">3</span>
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-gray-500 text-white rounded-lg text-sm font-bold">
                Notifications
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">24</span>
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-bold">
                Notifications
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">15</span>
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold">
                Notifications
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">24</span>
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-bold">
                Notifications
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">3</span>
              </button>
              <button className="flex items-center justify-between px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-bold">
                Notifications
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">15</span>
              </button>
            </div>
          </div>
        </div>

        {/* Headings */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Headings</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-gray-900">Example heading</h1>
              <Badge variant="primary">New</Badge>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-bold text-gray-900">Example heading</h2>
              <Badge variant="secondary">New</Badge>
            </div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-bold text-gray-900">Example heading</h3>
              <Badge variant="success">New</Badge>
            </div>
            <div className="flex items-center gap-3">
              <h4 className="text-xl font-bold text-gray-900">Example heading</h4>
              <Badge variant="info">New</Badge>
            </div>
            <div className="flex items-center gap-3">
              <h5 className="text-lg font-bold text-gray-900">Example heading</h5>
              <Badge variant="warning">New</Badge>
            </div>
            <div className="flex items-center gap-3">
              <h6 className="text-base font-bold text-gray-900">Example heading</h6>
              <Badge variant="danger">New</Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
