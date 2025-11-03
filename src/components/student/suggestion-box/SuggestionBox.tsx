"use client";

import React, { useState } from "react";
import { Tabs, SubTabs } from "./Tabs";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";

export const SuggestionBox: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Inbox");
  const [activeSubTab, setActiveSubTab] = useState("Need to Clarify");

  const mainTabs = ["Inbox", "Under Process", "Closed"];
  const subTabs = ["Need to Clarify", "Need to Closed"];

  const renderContent = () => {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-gray-100 text-gray-600 px-6 py-4 rounded-md text-center">
          No Messages
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Suggestion Box</h1>
          <Button
            className="bg-[#9b8aff] hover:bg-[#8a7ae6] text-white px-4 py-2 flex items-center gap-2"
            onClick={() => {
              // Handle post new complaint/suggestion
              console.log("Post new complaint/suggestion clicked");
            }}
          >
            <Mail className="w-4 h-4" />
            Post New Complaint/Suggestion
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={mainTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mb-6"
        />

        {/* Sub-tabs for Inbox */}
        {activeTab === "Inbox" && (
          <SubTabs
            subTabs={subTabs}
            activeSubTab={activeSubTab}
            onSubTabChange={setActiveSubTab}
          />
        )}

        {/* Content Area */}
        <div className="mt-8 bg-[#1a1f3a] rounded-lg p-6 min-h-[400px]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
