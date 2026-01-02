import { TabState } from "@/src/types/stateTypes";

type ProfileTabButtonType = {
    tab: TabState;
    label: string;
    icon: React.ReactNode;
    activeTab: TabState;
    setActiveTab: (t: TabState) => void;
}

export default function ProfileTabButton({ tab, label, icon, activeTab, setActiveTab }: ProfileTabButtonType) {
    return (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center space-x-2 
                ${activeTab === tab
                    ? 'text-blue-600 border-b-4 border-blue-600 bg-blue-50/50'
                    : 'text-gray-500 hover:text-gray-700 border-b-4 border-transparent'}`}>
            {icon}
            <span>{label}</span>
        </button>
    )
}
