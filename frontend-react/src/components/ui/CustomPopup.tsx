import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, ShieldAlert } from 'lucide-react';

export type PopupType = 'info' | 'success' | 'warning' | 'error' | 'confirm';

interface CustomPopupProps {
    isOpen: boolean;
    type: PopupType;
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({
    isOpen,
    type,
    title,
    message,
    onClose,
    onConfirm
}) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        handleClose();
    };

    const icons = {
        info: <Info className="w-8 h-8 text-blue-400" />,
        success: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
        warning: <AlertTriangle className="w-8 h-8 text-amber-400" />,
        error: <AlertCircle className="w-8 h-8 text-red-400" />,
        confirm: <ShieldAlert className="w-8 h-8 text-cyan-400" />
    };

    const colors = {
        info: 'border-blue-500/30 bg-blue-500/10',
        success: 'border-emerald-500/30 bg-emerald-500/10',
        warning: 'border-amber-500/30 bg-amber-500/10',
        error: 'border-red-500/30 bg-red-500/10',
        confirm: 'border-cyan-500/30 bg-cyan-500/10'
    };

    return (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 transition-all duration-300 ${isAnimating ? 'opacity-100 backdrop-blur-md' : 'opacity-0'}`}>
            <div
                className={`absolute inset-0 bg-black/60`}
                onClick={type !== 'confirm' ? handleClose : undefined}
            />

            <div className={`relative w-full max-w-md overflow-hidden rounded-2xl border ${colors[type]} bg-black/80 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${isAnimating ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
                {/* Decorative background glow */}
                <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] opacity-20 ${type === 'error' ? 'bg-red-500' : 'bg-cyan-500'}`} />

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl bg-white/5 border border-white/10`}>
                            {icons[type]}
                        </div>
                        <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
                    </div>

                    <div className="text-gray-300 text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                        {message}
                    </div>

                    <div className="flex gap-3 justify-end">
                        {type === 'confirm' && (
                            <button
                                onClick={handleClose}
                                className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            onClick={type === 'confirm' ? handleConfirm : handleClose}
                            className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${type === 'error' ? 'bg-red-500 hover:bg-red-400 text-white' :
                                type === 'confirm' ? 'bg-cyan-500 hover:bg-cyan-400 text-black' :
                                    'bg-white/10 hover:bg-white/20 text-white'
                                }`}
                        >
                            {type === 'confirm' ? 'Confirm Action' : 'Close'}
                        </button>
                    </div>
                </div>

                {/* Progress bar for auto-close could be added here if needed */}
            </div>
        </div>
    );
};

export default CustomPopup;
