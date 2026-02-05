import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertTriangle, FileText, BarChart3 } from 'lucide-react';
import { type AllocationPlan, type Resource, type DisasterZone } from '../lib/api';
import HelpDeskStatus from './HelpDeskStatus';
import HelpDeskReport from './HelpDeskReport';

interface HelpDeskState {
    allocationPlan: AllocationPlan;
    resources: Resource[];
    zones: DisasterZone[];
    selectedZoneId: string;
    dispatchStatus?: string | null;
}

const HelpDesk: React.FC = () => {
    const location = useLocation();

    const [activeTab, setActiveTab] = useState<'report' | 'status'>('report');

    // Try to get state from location, or fallback to localStorage
    const [state, setHelpDeskState] = React.useState<HelpDeskState | null>(() => {
        if (location.state) return location.state as HelpDeskState;

        const saved = localStorage.getItem('helpDeskData');
        return saved ? JSON.parse(saved) : null;
    });

    // Listen for storage events to update in real-time across tabs
    React.useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'helpDeskData' && e.newValue) {
                const newData = JSON.parse(e.newValue);
                setHelpDeskState(newData);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleReportSubmit = (data: any) => {
        console.log("Report Submitted:", data);
        // In a real app, this would POST to backend.
        // For now, we simulate success and switch to status view
        alert("Report Received! Dispatching nearest units.");
        setActiveTab('status');
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col bg-grid relative overflow-hidden pt-24">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/10 via-background to-background pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[150px] rounded-full pointer-events-none" />



            {/* Main Content */}
            <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
                {/* Internal Tab Switcher (Moved from Header) */}
                <div className="flex justify-center mb-8">
                    <div className="flex p-1 bg-white/5 backdrop-blur-md border border-white/5 rounded-full w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('report')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'report'
                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <FileText size={16} /> Report Incident
                        </button>
                        <button
                            onClick={() => setActiveTab('status')}
                            className={`flex-1 md:flex-none px-6 py-2 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'status'
                                ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <BarChart3 size={16} /> My Status
                        </button>
                    </div>
                </div>

                {activeTab === 'report' ? (
                    <HelpDeskReport onSubmit={handleReportSubmit} />
                ) : (
                    <>
                        {/* Only show status if we have state, otherwise show fallback */}
                        {state && state.allocationPlan ? (
                            <HelpDeskStatus
                                allocationPlan={state.allocationPlan}
                                resources={state.resources}
                                zones={state.zones}
                                selectedZoneId={state.selectedZoneId}
                                dispatchStatus={state.dispatchStatus}
                            />
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-800 rounded-xl bg-gray-900/30">
                                <div className="bg-gray-800 p-6 rounded-full mb-6">
                                    <AlertTriangle size={48} className="text-yellow-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-200 mb-2">No Active Operations</h2>
                                <p className="text-gray-400 max-w-md">
                                    You haven't reported any incidents or been assigned to an active operation yet.
                                    Please use the <b>Report Incident</b> tab to request help.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
};

export default HelpDesk;
