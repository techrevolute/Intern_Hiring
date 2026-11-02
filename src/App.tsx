/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { RoleAndSkillsSections } from './components/RoleAndSkillsSections';
import { InternApplicationForm } from './components/InternApplicationForm';
import { ContactAndFooter } from './components/ContactAndFooter';
import { PortalModal } from './components/PortalModal';

export default function App() {
  const [portalOpen, setPortalOpen] = useState(false);
  const [portalTab, setPortalTab] = useState<'status' | 'recruiter'>('status');

  const handleOpenPortal = (tab: 'status' | 'recruiter') => {
    setPortalTab(tab);
    setPortalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <RoleAndSkillsSections />
        <InternApplicationForm />
      </main>
      <ContactAndFooter onOpenPortal={handleOpenPortal} />
      <PortalModal
        isOpen={portalOpen}
        initialTab={portalTab}
        onClose={() => setPortalOpen(false)}
      />
    </div>
  );
}
