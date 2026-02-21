import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const TOAST_CONFIG = {
    success: {
        icon: CheckCircle2,
        bg: 'bg-emerald-500/15 border-emerald-500/30',
        text: 'text-emerald-400',
        iconColor: 'text-emerald-400',
    },
    error: {
        icon: AlertCircle,
        bg: 'bg-rose-500/15 border-rose-500/30',
        text: 'text-rose-300',
        iconColor: 'text-rose-400',
    },
    info: {
        icon: Info,
        bg: 'bg-indigo-500/15 border-indigo-500/30',
        text: 'text-indigo-300',
        iconColor: 'text-indigo-400',
    },
};

const ToastItem = ({ toast, onRemove }) => {
    const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
    const Icon = config.icon;

    return (
        <div className={`
      toast-enter flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl shadow-black/40
      min-w-[260px] max-w-sm ${config.bg}
    `}>
            <Icon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
            <p className={`flex-1 text-sm font-medium ${config.text}`}>{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="text-slate-500 hover:text-slate-300 flex-shrink-0"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </div>
    );
};

const ToastContainer = ({ toasts, onRemove }) => {
    return (
        <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};

export default ToastContainer;
