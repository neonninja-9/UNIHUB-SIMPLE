import React from "react";

interface TabProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = "",
}) => {
  return (
    <div className={`flex space-x-6 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`pb-2 text-sm font-medium transition-colors relative ${
            activeTab === tab
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-400 hover:text-gray-300"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

interface SubTabsProps {
  subTabs: string[];
  activeSubTab: string;
  onSubTabChange: (subTab: string) => void;
  className?: string;
}

export const SubTabs: React.FC<SubTabsProps> = ({
  subTabs,
  activeSubTab,
  onSubTabChange,
  className = "",
}) => {
  return (
    <div className={`flex space-x-4 mt-4 ${className}`}>
      {subTabs.map((subTab) => (
        <button
          key={subTab}
          onClick={() => onSubTabChange(subTab)}
          className={`px-4 py-2 text-sm rounded-md border transition-all ${
            activeSubTab === subTab
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
          }`}
        >
          {subTab}
        </button>
      ))}
    </div>
  );
};
