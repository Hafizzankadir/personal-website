import { useState } from 'react';

export default function CopyLinkButton({ url, label = 'Copy Link', className = 'copy-link-btn' }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (e.g. insecure context) — nothing sensible to fall back to.
    }
  }

  return (
    <button type="button" className={className} onClick={handleClick}>
      {copied ? 'Copied!' : label}
    </button>
  );
}
