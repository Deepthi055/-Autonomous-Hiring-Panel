import React from 'react';
import { CheckCircle, Server, Monitor, Database, Brain, Cloud } from 'lucide-react';
import { ROLES, JD_TEMPLATES } from '../utils/jobTemplates';

const ICONS = { Server, Monitor, Database, Brain, Cloud };

const RoleSelector = ({ selectedRole, onSelect }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ROLES.map((role) => {
                const Icon = ICONS[role.icon] || Server;
                const isSelected = selectedRole === role.id;

                return (
                    <button
                        key={role.id}
                        id={`role-${role.id.replace(/\//g, '-').replace(/\s+/g, '-').toLowerCase()}`}
                        onClick={() => onSelect(role.id)}
                        className={`
              role-card relative flex items-center gap-3 p-4 rounded-xl border text-left w-full
              ${isSelected
                                ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                                : 'border-slate-700/60 bg-slate-800/40 hover:border-indigo-500/40'
                            }
            `}
                    >
                        <div className={`
              p-2 rounded-lg flex-shrink-0
              ${isSelected ? 'bg-indigo-500/20' : 'bg-slate-700/50'}
            `}>
                            <Icon className={`w-5 h-5 ${isSelected ? 'text-indigo-400' : 'text-slate-400'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold ${isSelected ? 'text-indigo-300' : 'text-slate-300'}`}>
                                {role.label}
                            </p>
                        </div>
                        {isSelected && (
                            <CheckCircle className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default RoleSelector;
