import { MoreVertical } from 'lucide-react';

const projects = [
  { code: '#PR0001', name: 'Office Management', members: 2, budget: '$42,000', dueDate: '24 Dec 2025', status: 'Completed', logo: '🏢' },
  { code: '#PR0002', name: 'Clinic Management', members: 3, budget: '$50,000', dueDate: '10 Dec 2025', status: 'In Progress', logo: '🏥' },
  { code: '#PR0003', name: 'Educational Platform', members: 3, budget: '$27,000', dueDate: '27 Nov 2025', status: 'Completed', logo: '🎓' },
  { code: '#PR0004', name: 'Chat & Call Mobile App', members: 3, budget: '$48,000', dueDate: '27 Nov 2025', status: 'New', logo: '📱' },
  { code: '#PR0005', name: 'Travel Planning Website', members: 2, budget: '$36,000', dueDate: '06 Nov 2025', status: 'New', logo: '✈️' },
];

export default function ProjectTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-white border-b border-gray-100">
          <tr>
            <th className="p-4 font-semibold text-gray-700 text-sm">Project Code</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Project Name</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Team Members</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Budget</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Due Date</th>
            <th className="p-4 font-semibold text-gray-700 text-sm">Status</th>
            <th className="p-4"></th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.code} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="p-4 text-gray-600 text-sm font-medium">{project.code}</td>
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg shadow-sm">
                    {project.logo}
                  </div>
                  <span className="font-semibold text-gray-800 text-sm">{project.name}</span>
                </div>
              </td>
              <td className="p-4">
                <div className="flex -space-x-2">
                  {[...Array(project.members)].map((_, i) => (
                    <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <img src={`https://picsum.photos/seed/${project.code}-${i}/40/40`} alt="avatar" referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">
                    +{project.members}
                  </div>
                </div>
              </td>
              <td className="p-4 text-gray-600 text-sm">{project.budget}</td>
              <td className="p-4 text-gray-500 text-sm">{project.dueDate}</td>
              <td className="p-4">
                <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                  project.status === 'Completed' ? 'bg-green-50 text-green-500' : 
                  project.status === 'In Progress' ? 'bg-blue-50 text-blue-500' : 
                  'bg-red-50 text-red-500'
                }`}>
                  {project.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                  <MoreVertical size={16} className="text-gray-400" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
