'use client';

import { useState } from 'react';

/* Copies the picked workflow or command. A clipboard refusal is said in words. */
export default function CopyBlock({ text, file }: { text: string; file: string }) {
  const [state, setState] = useState<{ text: string; ok: boolean } | null>(null);
  const shown = state && state.text === text ? state : null;
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState({ text, ok: true });
    } catch {
      setState({ text, ok: false });
    }
  }
  return (
    <div className="sv-copy">
      <div className="sv-file">
        <span>{file}</span>
      </div>
      <pre className="sv-code" tabIndex={0}>{text}</pre>
      <button type="button" className="sv-primary" onClick={copy}>
        {shown?.ok ? (file === 'terminal' ? 'Copied. Paste it into a terminal.' : 'Copied. Paste it into the workflow file.') : 'Copy it'}
      </button>
      <p className="sv-copy-status" role="status" aria-live="polite">
        {shown && !shown.ok ? 'This browser blocked the clipboard. Select the text above and copy it manually.' : ''}
      </p>
    </div>
  );
}
