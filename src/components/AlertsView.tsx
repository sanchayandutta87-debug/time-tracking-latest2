import React from 'react';
import { ChevronRight, Home, AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

interface AlertProps {
  variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  icon?: React.ReactNode;
  outline?: boolean;
  solid?: boolean;
  leftBorder?: boolean;
}

const Alert: React.FC<AlertProps> = ({ variant, title, children, onClose, icon, outline, solid, leftBorder }) => {
  const variants = {
    primary: solid ? 'bg-blue-600 border-blue-600 text-white' : outline ? 'border-blue-600 text-blue-600' : 'bg-blue-50 border-blue-100 text-blue-700',
    secondary: solid ? 'bg-gray-600 border-gray-600 text-white' : outline ? 'border-gray-600 text-gray-600' : 'bg-gray-50 border-gray-100 text-gray-700',
    success: solid ? 'bg-emerald-600 border-emerald-600 text-white' : outline ? 'border-emerald-600 text-emerald-600' : 'bg-emerald-50 border-emerald-100 text-emerald-700',
    danger: solid ? 'bg-red-600 border-red-600 text-white' : outline ? 'border-red-600 text-red-600' : 'bg-red-50 border-red-100 text-red-700',
    warning: solid ? 'bg-amber-600 border-amber-600 text-white' : outline ? 'border-amber-600 text-amber-600' : 'bg-amber-50 border-amber-100 text-amber-700',
    info: solid ? 'bg-cyan-600 border-cyan-600 text-white' : outline ? 'border-cyan-600 text-cyan-600' : 'bg-cyan-50 border-cyan-100 text-cyan-700',
    light: solid ? 'bg-gray-100 border-gray-100 text-gray-800' : outline ? 'border-gray-200 text-gray-400' : 'bg-white border-gray-100 text-gray-500',
    dark: solid ? 'bg-gray-900 border-gray-900 text-white' : outline ? 'border-gray-800 text-gray-800' : 'bg-gray-800 border-gray-700 text-white',
  };

  const borderClasses = leftBorder ? 'border-l-4 rounded-l-none' : 'border rounded-lg';

  return (
    <div className={`flex items-start gap-3 p-4 ${borderClasses} ${variants[variant]} relative mb-4 shadow-sm`}>
      {icon && <div className="mt-0.5">{icon}</div>}
      <div className="flex-1">
        {title && <h4 className={`font-bold text-sm mb-1 ${solid ? 'text-white' : ''}`}>{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
      {onClose && (
        <button onClick={onClose} className={`p-1 rounded-md transition-colors ${solid ? 'hover:bg-white/20' : 'hover:bg-black/5'}`}>
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default function AlertsView() {
  const [dismissed, setDismissed] = React.useState<number[]>([]);

  const handleDismiss = (id: number) => {
    setDismissed([...dismissed, id]);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Alerts</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Base UI</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Alerts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Basic Alerts</h2>
          </div>
          <div className="p-6">
            <Alert variant="primary">A simple primary alert—check it out!</Alert>
            <Alert variant="secondary">A simple secondary alert—check it out!</Alert>
            <Alert variant="success">A simple success alert—check it out!</Alert>
            <Alert variant="danger">A simple danger alert—check it out!</Alert>
            <Alert variant="warning">A simple warning alert—check it out!</Alert>
            <Alert variant="info">A simple info alert—check it out!</Alert>
          </div>
        </div>

        {/* Solid Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Solid Alerts</h2>
          </div>
          <div className="p-6">
            <Alert variant="primary" solid>A simple primary solid alert—check it out!</Alert>
            <Alert variant="success" solid>A simple success solid alert—check it out!</Alert>
            <Alert variant="warning" solid>A simple warning solid alert—check it out!</Alert>
            <Alert variant="danger" solid>A simple danger solid alert—check it out!</Alert>
            <Alert variant="info" solid>A simple info solid alert—check it out!</Alert>
            <Alert variant="dark" solid>A simple dark solid alert—check it out!</Alert>
          </div>
        </div>

        {/* Alerts with Icons */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Alerts with Icons</h2>
          </div>
          <div className="p-6">
            <Alert variant="primary" icon={<Info size={18} />}>
              An example alert with an icon
            </Alert>
            <Alert variant="success" icon={<CheckCircle2 size={18} />}>
              An example success alert with an icon
            </Alert>
            <Alert variant="warning" icon={<AlertTriangle size={18} />}>
              An example warning alert with an icon
            </Alert>
            <Alert variant="danger" icon={<AlertCircle size={18} />}>
              An example danger alert with an icon
            </Alert>
          </div>
        </div>

        {/* Left Border Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Left Border Alerts</h2>
          </div>
          <div className="p-6">
            <Alert variant="primary" leftBorder>A simple primary left border alert—check it out!</Alert>
            <Alert variant="success" leftBorder>A simple success left border alert—check it out!</Alert>
            <Alert variant="warning" leftBorder>A simple warning left border alert—check it out!</Alert>
            <Alert variant="danger" leftBorder>A simple danger left border alert—check it out!</Alert>
          </div>
        </div>

        {/* Outline Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Outline Alerts</h2>
          </div>
          <div className="p-6">
            <Alert variant="primary" outline>A simple primary outline alert—check it out!</Alert>
            <Alert variant="success" outline>A simple success outline alert—check it out!</Alert>
            <Alert variant="warning" outline>A simple warning outline alert—check it out!</Alert>
            <Alert variant="danger" outline>A simple danger outline alert—check it out!</Alert>
          </div>
        </div>

        {/* Dismissing Alerts */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Dismissing Alerts</h2>
          </div>
          <div className="p-6">
            {!dismissed.includes(1) && (
              <Alert variant="primary" onClose={() => handleDismiss(1)}>
                <strong>Holy guacamole!</strong> You should check in on some of those fields below.
              </Alert>
            )}
            {!dismissed.includes(2) && (
              <Alert variant="success" onClose={() => handleDismiss(2)}>
                <strong>Well done!</strong> You successfully read this important alert message.
              </Alert>
            )}
            {!dismissed.includes(3) && (
              <Alert variant="danger" onClose={() => handleDismiss(3)}>
                <strong>Oh snap!</strong> Change a few things up and try submitting again.
              </Alert>
            )}
          </div>
        </div>

        {/* Alerts with Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Alerts with Actions</h2>
          </div>
          <div className="p-6">
            <Alert variant="primary" icon={<Info size={18} />}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span>An example alert with an action button.</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700 transition-colors whitespace-nowrap">
                  Take Action
                </button>
              </div>
            </Alert>
            <Alert variant="warning" icon={<AlertTriangle size={18} />}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span>Your subscription is about to expire.</span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-amber-600 text-white text-xs font-bold rounded hover:bg-amber-700 transition-colors">
                    Renew
                  </button>
                  <button className="px-3 py-1 border border-amber-600 text-amber-600 text-xs font-bold rounded hover:bg-amber-600 hover:text-white transition-all">
                    Dismiss
                  </button>
                </div>
              </div>
            </Alert>
          </div>
        </div>

        {/* Alerts with Links */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Alerts with Links</h2>
          </div>
          <div className="p-6">
            <Alert variant="primary">
              A simple primary alert with <a href="#" className="font-bold underline hover:text-blue-900">an example link</a>. Give it a click if you like.
            </Alert>
            <Alert variant="success">
              A simple success alert with <a href="#" className="font-bold underline hover:text-emerald-900">an example link</a>. Give it a click if you like.
            </Alert>
            <Alert variant="danger">
              A simple danger alert with <a href="#" className="font-bold underline hover:text-red-900">an example link</a>. Give it a click if you like.
            </Alert>
          </div>
        </div>

        {/* Additional Content */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden lg:col-span-2">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Additional Content</h2>
          </div>
          <div className="p-6">
            <Alert variant="success" title="Well done!">
              <p className="mb-4">Aww yeah, you successfully read this important alert message. This example text is going to run a bit longer so that you can see how spacing within an alert works with this kind of content.</p>
              <hr className="border-emerald-200 mb-4" />
              <p className="mb-0">Whenever you need to, be sure to use margin utilities to keep things nice and tidy.</p>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}
