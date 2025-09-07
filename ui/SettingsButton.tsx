// File: src/components/ui/SettingsButton.tsx

'use client';

import { useState } from 'react';
import { Button } from './button';
import { Settings } from 'lucide-react';

export default function SettingsButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
        <Settings className="w-5 h-5" />
      </Button>

      {open && (
        <div className="absolute bottom-12 right-0 bg-white dark:bg-zinc-900 shadow-lg p-4 rounded-md w-64 text-sm text-muted-foreground">
          <p className="mb-2 font-semibold">Settings (Mocked)</p>
          <ul className="space-y-1">
            <li>• Theme toggle (coming soon)</li>
            <li>• Reflex sensitivity (coming soon)</li>
            <li>• Export logs (coming soon)</li>
          </ul>
        </div>
      )}
    </div>
  );
}
