import React from 'react';
import { ChevronRight, User, Check, Crown, Star } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  shape?: 'circle' | 'square' | 'rounded';
  initials?: string;
  badge?: number | string;
  iconBadge?: React.ReactNode;
  variant?: 'solid' | 'soft';
  color?: string;
  pulse?: boolean;
  label?: string;
  subLabel?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ 
  src, alt, size = 'md', status, shape = 'circle', initials, badge, iconBadge, variant = 'solid', color, pulse, label, subLabel, className = '' 
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    xxl: 'w-20 h-20 text-xl',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-gray-400',
    away: 'bg-amber-500',
    busy: 'bg-red-500',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
    xxl: 'w-5 h-5',
  };

  const badgeSizes = {
    xs: 'w-3 h-3 text-[8px]',
    sm: 'w-3.5 h-3.5 text-[9px]',
    md: 'w-4 h-4 text-[10px]',
    lg: 'w-5 h-5 text-[11px]',
    xl: 'w-6 h-6 text-xs',
    xxl: 'w-7 h-7 text-sm',
  };

  const getShapeClass = () => {
    if (shape === 'circle') return 'rounded-full';
    if (shape === 'square') return 'rounded-none';
    return 'rounded-xl';
  };

  const avatarContent = (
    <div className={`relative inline-block ${className}`}>
      <div className={`
        ${sizes[size]}
        ${getShapeClass()}
        ${color ? '' : 'bg-gray-100 border border-gray-200'}
        flex items-center justify-center overflow-hidden
      `} style={color ? { backgroundColor: color } : {}}>
        {src ? (
          <img src={src} alt={alt || 'Avatar'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : initials ? (
          <span className={`font-bold uppercase ${variant === 'soft' ? '' : 'text-white'}`}>{initials}</span>
        ) : (
          <User className="text-gray-400" size={size === 'xs' ? 14 : size === 'sm' ? 18 : 24} />
        )}
      </div>
      {status && (
        <div className="absolute bottom-0 right-0 flex items-center justify-center">
          {pulse && (
            <span className={`absolute inline-flex h-full w-full rounded-full ${statusColors[status]} opacity-75 animate-ping`}></span>
          )}
          <span className={`
            relative
            ${statusSizes[size]}
            ${statusColors[status]}
            border-2 border-white rounded-full
          `} />
        </div>
      )}
      {(badge !== undefined || iconBadge) && (
        <span className={`
          absolute -top-1 -right-1
          ${badgeSizes[size]}
          ${iconBadge ? 'bg-blue-600' : 'bg-red-500'}
          text-white font-bold rounded-full flex items-center justify-center border-2 border-white
        `}>
          {iconBadge || badge}
        </span>
      )}
    </div>
  );

  if (label) {
    return (
      <div className="flex items-center gap-3">
        {avatarContent}
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-800 leading-tight">{label}</span>
          {subLabel && <span className="text-xs text-gray-400">{subLabel}</span>}
        </div>
      </div>
    );
  }

  return avatarContent;
};

export default function AvatarView() {
  const faces = [
    "https://picsum.photos/seed/face1/100/100",
    "https://picsum.photos/seed/face2/100/100",
    "https://picsum.photos/seed/face3/100/100",
    "https://picsum.photos/seed/face4/100/100",
    "https://picsum.photos/seed/face5/100/100",
    "https://picsum.photos/seed/face6/100/100",
    "https://picsum.photos/seed/face7/100/100",
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Avatar</h1>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span>Home</span>
          <ChevronRight size={14} />
          <span>Base UI</span>
          <ChevronRight size={14} />
          <span className="text-gray-600">Avatar</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Avatars */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Avatars</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar shape="circle" size="xl" src={faces[0]} />
              <Avatar shape="rounded" size="xl" src={faces[1]} />
              <Avatar shape="square" size="xl" src={faces[2]} />
              <Avatar initials="SR" size="xl" color="#4f46e5" />
              <Avatar initials="SR" size="xl" color="#10b981" />
              <Avatar initials="SR" size="xl" color="#ef4444" />
            </div>
          </div>
        </div>

        {/* Avatar Sizes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Avatar Sizes</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-end gap-2">
              <Avatar size="xs" src={faces[0]} />
              <Avatar size="sm" src={faces[1]} />
              <Avatar size="md" src={faces[2]} />
              <Avatar size="lg" src={faces[3]} />
              <Avatar size="xl" src={faces[4]} />
              <Avatar size="xxl" src={faces[5]} />
              <Avatar className="w-24 h-24" src={faces[6]} />
            </div>
          </div>
        </div>

        {/* Avatar with Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Avatar with Status</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-end gap-4">
              <Avatar status="online" size="xs" src={faces[0]} />
              <Avatar status="offline" size="sm" src={faces[1]} />
              <Avatar status="away" size="md" src={faces[2]} />
              <Avatar status="busy" size="lg" src={faces[3]} />
              <Avatar status="online" size="xl" src={faces[4]} pulse />
              <Avatar status="busy" size="xxl" src={faces[5]} />
            </div>
          </div>
        </div>

        {/* Avatar with Badge */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Avatar with Badge</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-end gap-4">
              <Avatar badge={2} size="xs" src={faces[0]} />
              <Avatar badge={5} size="sm" src={faces[1]} />
              <Avatar badge={1} size="md" src={faces[2]} />
              <Avatar badge={7} size="lg" src={faces[3]} />
              <Avatar badge={3} size="xl" src={faces[4]} />
              <Avatar badge={9} size="xxl" src={faces[5]} />
            </div>
          </div>
        </div>

        {/* Avatar with Icon Badge */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Avatar with Icon Badge</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-6">
              <Avatar iconBadge={<Check size={12} />} size="lg" src={faces[0]} />
              <Avatar iconBadge={<Crown size={12} />} size="xl" src={faces[1]} />
              <Avatar iconBadge={<Star size={12} />} size="xxl" src={faces[2]} />
              <Avatar iconBadge={<Check size={10} />} size="md" initials="JD" color="#4f46e5" />
            </div>
          </div>
        </div>

        {/* Avatar with Label */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Avatar with Label</h2>
          </div>
          <div className="p-6 space-y-4">
            <Avatar label="John Doe" subLabel="Software Engineer" size="lg" src={faces[0]} status="online" />
            <Avatar label="Sarah Smith" subLabel="Product Manager" size="lg" src={faces[1]} status="away" />
            <Avatar label="Robert Taylor" subLabel="UI/UX Designer" size="lg" src={faces[2]} status="busy" />
          </div>
        </div>

        {/* Solid Background Color */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Solid Background Color</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Avatar initials="JD" size="lg" color="#4f46e5" />
              <Avatar initials="SR" size="lg" color="#6b7280" />
              <Avatar initials="BJ" size="lg" color="#10b981" />
              <Avatar initials="AD" size="lg" color="#0ea5e9" />
              <Avatar initials="CB" size="lg" color="#f59e0b" />
              <Avatar initials="KL" size="lg" color="#ef4444" />
            </div>
          </div>
        </div>

        {/* Soft Background Color */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Soft Background Color</h2>
          </div>
          <div className="p-6">
            <div className="flex flex-wrap items-center gap-3">
              <Avatar initials="JD" size="lg" color="#eef2ff" variant="soft" className="text-blue-600" />
              <Avatar initials="SR" size="lg" color="#f3f4f6" variant="soft" className="text-gray-600" />
              <Avatar initials="BJ" size="lg" color="#ecfdf5" variant="soft" className="text-emerald-600" />
              <Avatar initials="AD" size="lg" color="#f0f9ff" variant="soft" className="text-sky-600" />
              <Avatar initials="CB" size="lg" color="#fffbeb" variant="soft" className="text-amber-600" />
              <Avatar initials="KL" size="lg" color="#fef2f2" variant="soft" className="text-red-600" />
            </div>
          </div>
        </div>

        {/* Avatar Group - Square */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Avatar Group - Square</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex -space-x-2">
              <Avatar shape="square" size="lg" src="https://picsum.photos/seed/g1/100/100" className="ring-2 ring-white" />
              <Avatar shape="square" size="lg" src="https://picsum.photos/seed/g2/100/100" className="ring-2 ring-white" />
              <Avatar shape="square" size="lg" src="https://picsum.photos/seed/g3/100/100" className="ring-2 ring-white" />
              <div className="w-12 h-12 bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white">+8</div>
            </div>
            <div className="flex -space-x-2">
              <Avatar shape="square" size="md" src="https://picsum.photos/seed/g4/100/100" className="ring-2 ring-white" />
              <Avatar shape="square" size="md" src="https://picsum.photos/seed/g5/100/100" className="ring-2 ring-white" />
              <Avatar shape="square" size="md" src="https://picsum.photos/seed/g6/100/100" className="ring-2 ring-white" />
              <div className="w-10 h-10 bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold ring-2 ring-white">+8</div>
            </div>
            <div className="flex -space-x-2">
              <Avatar shape="square" size="sm" src="https://picsum.photos/seed/g7/100/100" className="ring-2 ring-white" />
              <Avatar shape="square" size="sm" src="https://picsum.photos/seed/g8/100/100" className="ring-2 ring-white" />
              <Avatar shape="square" size="sm" src="https://picsum.photos/seed/g9/100/100" className="ring-2 ring-white" />
              <div className="w-8 h-8 bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold ring-2 ring-white">+8</div>
            </div>
          </div>
        </div>

        {/* Avatar Group - Rounded */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50">
            <h2 className="text-lg font-bold text-gray-800">Avatar Group - Rounded</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex -space-x-3">
              <Avatar shape="circle" size="lg" src="https://picsum.photos/seed/r1/100/100" className="ring-4 ring-white" />
              <Avatar shape="circle" size="lg" src="https://picsum.photos/seed/r2/100/100" className="ring-4 ring-white" />
              <Avatar shape="circle" size="lg" src="https://picsum.photos/seed/r3/100/100" className="ring-4 ring-white" />
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold ring-4 ring-white">+8</div>
            </div>
            <div className="flex -space-x-3">
              <Avatar shape="circle" size="md" src="https://picsum.photos/seed/r4/100/100" className="ring-4 ring-white" />
              <Avatar shape="circle" size="md" src="https://picsum.photos/seed/r5/100/100" className="ring-4 ring-white" />
              <Avatar shape="circle" size="md" src="https://picsum.photos/seed/r6/100/100" className="ring-4 ring-white" />
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold ring-4 ring-white">+8</div>
            </div>
            <div className="flex -space-x-3">
              <Avatar shape="circle" size="sm" src="https://picsum.photos/seed/r7/100/100" className="ring-4 ring-white" />
              <Avatar shape="circle" size="sm" src="https://picsum.photos/seed/r8/100/100" className="ring-4 ring-white" />
              <Avatar shape="circle" size="sm" src="https://picsum.photos/seed/r9/100/100" className="ring-4 ring-white" />
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[8px] font-bold ring-4 ring-white">+8</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
