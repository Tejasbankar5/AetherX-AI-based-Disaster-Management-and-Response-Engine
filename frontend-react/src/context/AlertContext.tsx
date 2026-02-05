import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import CustomPopup from '../components/ui/CustomPopup';
import type { PopupType } from '../components/ui/CustomPopup';

interface AlertContextType {
    showAlert: (title: string, message: string, type?: PopupType) => void;
    showConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [queue, setQueue] = useState<{
        type: PopupType;
        title: string;
        message: string;
        onConfirm?: () => void;
    }[]>([]);

    const [current, setCurrent] = useState<{
        isOpen: boolean;
        type: PopupType;
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        isOpen: false,
        type: 'info',
        title: '',
        message: ''
    });

    useEffect(() => {
        if (!current.isOpen && queue.length > 0) {
            const next = queue[0];
            setQueue(prev => prev.slice(1));
            setCurrent({
                isOpen: true,
                ...next
            });
        }
    }, [current.isOpen, queue]);

    const showAlert = useCallback((title: string, message: string, type: PopupType = 'info') => {
        setQueue(prev => [...prev, { title, message, type }]);
    }, []);

    const showConfirm = useCallback((title: string, message: string, onConfirm: () => void) => {
        setQueue(prev => [...prev, { title, message, type: 'confirm', onConfirm }]);
    }, []);

    const handleClose = useCallback(() => {
        setCurrent(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            <CustomPopup
                isOpen={current.isOpen}
                type={current.type}
                title={current.title}
                message={current.message}
                onConfirm={current.onConfirm}
                onClose={handleClose}
            />
        </AlertContext.Provider>
    );
};
