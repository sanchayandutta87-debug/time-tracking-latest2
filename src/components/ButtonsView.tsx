import React, { useState } from 'react';
import { ChevronRight, Home, Bell, Mail, Edit, Trash2, Download, Smile, AlertTriangle, CheckCircle2, Loader2, Facebook, Twitter, Github, Linkedin, Instagram, Youtube, Plus } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark' | 'white';
  typeStyle?: 'default' | 'outline' | 'soft' | 'gradient' | 'gradient-2' | 'animation' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
  square?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  block?: boolean;
  active?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  typeStyle = 'default', 
  size = 'md',
  rounded = false,
  square = false,
  icon,
  loading,
  block,
  active,
  children,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const roundedClass = square ? 'rounded-none' : rounded ? 'rounded-full' : 'rounded-lg';
  const baseClasses = `
    inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 
    ${sizeClasses[size]} 
    ${roundedClass}
    ${block ? 'w-full' : ''}
    ${props.disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;

  const variants = {
    primary: {
      default: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
      outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white',
      soft: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-md',
      'gradient-2': 'bg-gradient-to-b from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 shadow-md',
      animation: 'bg-blue-600 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-blue-600 hover:bg-blue-50',
      glass: 'bg-blue-600/20 backdrop-blur-md border border-blue-600/30 text-blue-700 hover:bg-blue-600/30',
    },
    secondary: {
      default: 'bg-gray-600 text-white hover:bg-gray-700 shadow-sm',
      outline: 'border-2 border-gray-600 text-gray-600 hover:bg-gray-600 hover:text-white',
      soft: 'bg-gray-50 text-gray-600 hover:bg-gray-100',
      gradient: 'bg-gradient-to-r from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 shadow-md',
      'gradient-2': 'bg-gradient-to-b from-gray-500 to-gray-700 text-white hover:from-gray-600 hover:to-gray-800 shadow-md',
      animation: 'bg-gray-600 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-gray-600 hover:bg-gray-50',
      glass: 'bg-gray-600/20 backdrop-blur-md border border-gray-600/30 text-gray-700 hover:bg-gray-600/30',
    },
    success: {
      default: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
      outline: 'border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white',
      soft: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
      gradient: 'bg-gradient-to-r from-emerald-500 to-emerald-700 text-white hover:from-emerald-600 hover:to-emerald-800 shadow-md',
      'gradient-2': 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white hover:from-emerald-600 hover:to-emerald-800 shadow-md',
      animation: 'bg-emerald-600 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-emerald-600 hover:bg-emerald-50',
      glass: 'bg-emerald-600/20 backdrop-blur-md border border-emerald-600/30 text-emerald-700 hover:bg-emerald-600/30',
    },
    danger: {
      default: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
      outline: 'border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white',
      soft: 'bg-red-50 text-red-600 hover:bg-red-100',
      gradient: 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 shadow-md',
      'gradient-2': 'bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 shadow-md',
      animation: 'bg-red-600 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-red-600 hover:bg-red-50',
      glass: 'bg-red-600/20 backdrop-blur-md border border-red-600/30 text-red-700 hover:bg-red-600/30',
    },
    warning: {
      default: 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm',
      outline: 'border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-white',
      soft: 'bg-amber-50 text-amber-600 hover:bg-amber-100',
      gradient: 'bg-gradient-to-r from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 shadow-md',
      'gradient-2': 'bg-gradient-to-b from-amber-400 to-amber-600 text-white hover:from-amber-500 hover:to-amber-700 shadow-md',
      animation: 'bg-amber-500 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-amber-600 hover:bg-amber-50',
      glass: 'bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-700 hover:bg-amber-500/30',
    },
    info: {
      default: 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm',
      outline: 'border-2 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white',
      soft: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
      gradient: 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-white hover:from-cyan-500 hover:to-cyan-700 shadow-md',
      'gradient-2': 'bg-gradient-to-b from-cyan-400 to-cyan-600 text-white hover:from-cyan-500 hover:to-cyan-700 shadow-md',
      animation: 'bg-cyan-500 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-cyan-600 hover:bg-cyan-50',
      glass: 'bg-cyan-500/20 backdrop-blur-md border border-cyan-500/30 text-cyan-700 hover:bg-cyan-500/30',
    },
    light: {
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200 shadow-sm',
      outline: 'border-2 border-gray-200 text-gray-400 hover:bg-gray-100 hover:text-gray-800',
      soft: 'bg-gray-50 text-gray-400 hover:bg-gray-100',
      gradient: 'bg-gradient-to-r from-gray-50 to-gray-200 text-gray-600 hover:from-gray-100 hover:to-gray-300 shadow-sm',
      'gradient-2': 'bg-gradient-to-b from-gray-50 to-gray-200 text-gray-600 hover:from-gray-100 hover:to-gray-300 shadow-sm',
      animation: 'bg-gray-100 text-gray-800 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-gray-400 hover:bg-gray-50',
      glass: 'bg-gray-100/20 backdrop-blur-md border border-gray-100/30 text-gray-600 hover:bg-gray-100/30',
    },
    dark: {
      default: 'bg-gray-900 text-white hover:bg-black shadow-sm',
      outline: 'border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white',
      soft: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      gradient: 'bg-gradient-to-r from-gray-800 to-black text-white hover:from-black hover:to-gray-900 shadow-md',
      'gradient-2': 'bg-gradient-to-b from-gray-800 to-black text-white hover:from-black hover:to-gray-900 shadow-md',
      animation: 'bg-gray-900 text-white hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-gray-800 hover:bg-gray-100',
      glass: 'bg-gray-900/20 backdrop-blur-md border border-gray-900/30 text-gray-800 hover:bg-gray-900/30',
    },
    white: {
      default: 'bg-white text-gray-800 border border-gray-200 hover:bg-gray-50 shadow-sm',
      outline: 'border-2 border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-800',
      soft: 'bg-gray-50 text-gray-400 hover:bg-gray-100',
      gradient: 'bg-gradient-to-r from-white to-gray-100 text-gray-600 hover:from-gray-50 hover:to-gray-200 shadow-sm',
      'gradient-2': 'bg-gradient-to-b from-white to-gray-100 text-gray-600 hover:from-gray-50 hover:to-gray-200 shadow-sm',
      animation: 'bg-white text-gray-800 border border-gray-200 hover:translate-y-[-2px] hover:shadow-lg active:translate-y-0',
      ghost: 'text-gray-400 hover:bg-gray-50',
      glass: 'bg-white/20 backdrop-blur-md border border-white/30 text-gray-800 hover:bg-white/30',
    }
  };

  const activeClass = active ? 'ring-2 ring-offset-2 ring-blue-500' : '';

  return (
    <button className={`${baseClasses} ${variants[variant][typeStyle]} ${activeClass} ${className}`} {...props}>
      {loading && <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'md' ? 18 : 22} />}
      {!loading && icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default function ButtonsView() {
  const variants: ButtonProps['variant'][] = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark', 'white'];
  const [toggleActive, setToggleActive] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Buttons</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Home size={14} />
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Base UI</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Buttons</span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Default Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Default Buttons</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the btn class to show the default button style.</p>
            <div className="flex flex-wrap gap-3">
              {variants.map(v => (
                <Button key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Outline Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Outline Buttons</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the btn-outline- class with the below-mentioned variation to create a button with the outline.</p>
            <div className="flex flex-wrap gap-3">
              {variants.filter(v => v !== 'white').map(v => (
                <Button key={v} variant={v} typeStyle="outline">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Rounded Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Rounded Buttons</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the rounded-pill class to make a rounded button.</p>
            <div className="flex flex-wrap gap-3">
              {variants.filter(v => v !== 'white').map(v => (
                <Button key={v} variant={v} rounded>{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Soft Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Soft Buttons</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the btn-soft- class with the below-mentioned variation to create a button with the soft background.</p>
            <div className="flex flex-wrap gap-3">
              {variants.filter(v => v !== 'white').map(v => (
                <Button key={v} variant={v} typeStyle="soft">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Ghost Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Ghost Buttons</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Buttons with no background or border until hover.</p>
            <div className="flex flex-wrap gap-3">
              {variants.filter(v => v !== 'white').map(v => (
                <Button key={v} variant={v} typeStyle="ghost">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Glassmorphism Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Glassmorphism Buttons</h2>
          </div>
          <div className="p-6 bg-gradient-to-br from-blue-400 to-purple-500">
            <div className="flex flex-wrap gap-3">
              {variants.filter(v => v !== 'white').map(v => (
                <Button key={v} variant={v} typeStyle="glass">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Loading Buttons</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" loading>Loading</Button>
              <Button variant="success" loading>Processing</Button>
              <Button variant="danger" loading>Deleting</Button>
              <Button variant="warning" loading>Saving</Button>
            </div>
          </div>
        </div>

        {/* Button Groups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Button Groups</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-4">Horizontal Group</p>
              <div className="inline-flex rounded-lg shadow-sm">
                <Button variant="white" className="rounded-r-none border-r-0">Left</Button>
                <Button variant="white" className="rounded-none border-r-0">Middle</Button>
                <Button variant="white" className="rounded-l-none">Right</Button>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-4">Vertical Group</p>
              <div className="inline-flex flex-col rounded-lg shadow-sm">
                <Button variant="white" className="rounded-b-none border-b-0">Top</Button>
                <Button variant="white" className="rounded-none border-b-0">Middle</Button>
                <Button variant="white" className="rounded-t-none">Bottom</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Gradient Buttons</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the button classes on an &lt;a&gt;, &lt;button&gt;, or &lt;input&gt; element.</p>
            <div className="flex flex-wrap gap-3">
              {variants.filter(v => v !== 'white').map(v => (
                <Button key={v} variant={v} typeStyle="gradient">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient Buttons 2 */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Gradient Buttons 2</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the bg-*-gradient class to create a gradient button.</p>
            <div className="flex flex-wrap gap-3">
              {variants.filter(v => v !== 'white').map(v => (
                <Button key={v} variant={v} typeStyle="gradient-2">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Animation Button */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Animation Button</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the btn-animation class to create a animation effect.</p>
            <div className="flex flex-wrap gap-3">
              {['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'].map(v => (
                <Button key={v} variant={v as any} typeStyle="animation">{v.charAt(0).toUpperCase() + v.slice(1)}</Button>
              ))}
            </div>
          </div>
        </div>

        {/* Social Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Social Buttons</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button className="bg-[#3b5998] text-white hover:bg-[#2d4373]" icon={<Facebook size={18} />}>Facebook</Button>
              <Button className="bg-[#1da1f2] text-white hover:bg-[#0c85d0]" icon={<Twitter size={18} />}>Twitter</Button>
              <Button className="bg-[#333] text-white hover:bg-[#222]" icon={<Github size={18} />}>Github</Button>
              <Button className="bg-[#0077b5] text-white hover:bg-[#005885]" icon={<Linkedin size={18} />}>Linkedin</Button>
              <Button className="bg-[#e1306c] text-white hover:bg-[#c13584]" icon={<Instagram size={18} />}>Instagram</Button>
              <Button className="bg-[#ff0000] text-white hover:bg-[#cc0000]" icon={<Youtube size={18} />}>Youtube</Button>
            </div>
          </div>
        </div>

        {/* Buttons with Label */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Buttons with Label</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the btn-label class to create a button with the label.</p>
            <div className="flex flex-wrap gap-6">
              <div className="flex gap-3">
                <Button variant="primary" icon={<Smile size={18} />}>Primary</Button>
                <Button variant="warning" icon={<AlertTriangle size={18} />}>Warning</Button>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" rounded icon={<Smile size={18} />}>Primary</Button>
                <Button variant="success" rounded icon={<CheckCircle2 size={18} />}>Success</Button>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" square className="rounded-none" icon={<Smile size={18} />}>Primary</Button>
                <Button variant="success" square className="rounded-none" icon={<CheckCircle2 size={18} />}>Success</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Buttons Sizes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Buttons Sizes</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use btn-lg class to create a large size button and btn-sm class to create a small size button.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" variant="primary">Large</Button>
              <Button size="md" variant="success">Normal</Button>
              <Button size="sm" variant="danger">Small</Button>
            </div>
          </div>
        </div>

        {/* Buttons Toggle States */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Buttons Toggle States</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use the data-bs-toggle="button" to toggle a button's active state.</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="white" onClick={() => setToggleActive(!toggleActive)} active={toggleActive}>Toggle button</Button>
              <Button variant="white" active>Active toggle button</Button>
              <Button variant="white" disabled>Disabled toggle button</Button>
              <Button variant="primary" onClick={() => setToggleActive(!toggleActive)} active={toggleActive}>Toggle button</Button>
              <Button variant="primary" active>Active toggle button</Button>
              <Button variant="primary" disabled>Disabled toggle button</Button>
            </div>
          </div>
        </div>

        {/* Button Tags */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Button Tags</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">The .btn classes are designed to be used with the &lt;button&gt; element. However, you can also use these classes on &lt;a&gt; or &lt;input&gt; elements (though some browsers may apply a slightly different rendering).</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Link</Button>
              <Button variant="primary">Button</Button>
              <Button variant="primary">Input</Button>
              <Button variant="primary">Submit</Button>
              <Button variant="primary">Reset</Button>
            </div>
          </div>
        </div>

        {/* Icon Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Icon Buttons</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500 mb-6">Use btn-icon class to wrap icon in button</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary" className="p-2 w-10 h-10" icon={<Bell size={18} />} />
              <Button variant="secondary" className="p-2 w-10 h-10" icon={<Mail size={18} />} />
              <Button variant="info" className="p-2 w-10 h-10" icon={<Edit size={18} />} />
              <Button variant="danger" className="p-2 w-10 h-10" icon={<Trash2 size={18} />} />
              
              <Button variant="primary" typeStyle="outline" className="p-2 w-10 h-10" icon={<Bell size={18} />} />
              <Button variant="secondary" typeStyle="outline" className="p-2 w-10 h-10" icon={<Mail size={18} />} />
              <Button variant="info" typeStyle="outline" className="p-2 w-10 h-10" icon={<Edit size={18} />} />
              <Button variant="danger" typeStyle="outline" className="p-2 w-10 h-10" icon={<Trash2 size={18} />} />
              <Button variant="white" className="p-2 w-10 h-10" icon={<Download size={18} />} />
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Floating Action Buttons</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" rounded className="w-12 h-12 p-0 shadow-lg" icon={<Plus size={24} />} />
              <Button variant="success" rounded className="w-12 h-12 p-0 shadow-lg" icon={<CheckCircle2 size={24} />} />
              <Button variant="danger" rounded className="w-12 h-12 p-0 shadow-lg" icon={<Trash2 size={24} />} />
              <Button variant="warning" rounded className="w-12 h-12 p-0 shadow-lg" icon={<Bell size={24} />} />
            </div>
          </div>
        </div>

        {/* Block Buttons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Block Buttons</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-500 mb-6">Use the d-grid class to create a full-width block button.</p>
            <Button variant="primary" block>Button</Button>
            <Button variant="warning" block>Button</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
