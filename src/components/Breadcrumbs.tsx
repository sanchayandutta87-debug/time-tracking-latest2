import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbPath {
    name: string;
    href: string;
}

interface BreadcrumbsProps {
    paths: BreadcrumbPath[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ paths }) => {
    return (
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
            {paths.map((path, index) => (
                <React.Fragment key={index}>
                    {index > 0 && <ChevronRight size={14} className="text-gray-400" />}
                    <a 
                        href={path.href} 
                        className={`hover:text-blue-600 transition-colors ${index === paths.length - 1 ? 'font-medium text-gray-900 dark:text-white pointer-events-none' : ''}`}
                        onClick={(e) => {
                            if (path.href === '/') {
                                e.preventDefault();
                                // In this app we use onViewChange, but Breadcrumbs is generic.
                            }
                        }}
                    >
                        {path.name}
                    </a>
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumbs;
