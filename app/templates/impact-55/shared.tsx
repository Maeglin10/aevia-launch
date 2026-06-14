"use client";

import React, { useState, useEffect } from "react";

// ── CODE RAIN COLUMNS ─────────────────────────────────────────────────────────
export const RAIN_COLUMNS = [
  { chars: "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ01バイト01", left: "3%",  duration: "8s",  delay: "0s"    },
  { chars: "10101010アクセス拒否01システム01010101010101", left: "10%", duration: "12s", delay: "1.4s"  },
  { chars: "GHOSTSHELL_v2.4.1_INIT_OK_SCAN_COMPLETE_01", left: "17%", duration: "9s",  delay: "0.7s"  },
  { chars: "01101001ｷﾞｬｯﾌﾟ01001011ゴースト01010011", left: "24%", duration: "15s", delay: "2.1s"  },
  { chars: "ACCESS_GRANTED_0x4F_0x4B_10110010101011", left: "31%", duration: "11s", delay: "0.3s"  },
  { chars: "ﾊﾌﾎﾐﾒﾔﾖﾗﾘﾙﾚﾛﾜｦﾝ01011101シェル010011", left: "38%", duration: "7s",  delay: "3.2s"  },
  { chars: "ROOTKIT_DETECTED_FALSE_POSITIVE_CLEAR_OK", left: "45%", duration: "13s", delay: "1.1s"  },
  { chars: "10001001ﾊﾐﾋｰｳｼﾅ01010101ネット01010", left: "52%", duration: "10s", delay: "2.8s"  },
  { chars: "ENCRYPTING_PAYLOAD_AES256_KEY_EXCHANGE_OK", left: "59%", duration: "16s", delay: "0.5s"  },
  { chars: "01010111アクセス01001011ゴースト_シェル", left: "66%", duration: "8s",  delay: "4.0s"  },
  { chars: "GHOST_SHELL_DAEMON_PID_4291_UPTIME_99.99", left: "73%", duration: "11s", delay: "1.7s"  },
  { chars: "10110010ｷﾞｬｯﾌﾟ01001011ネット01010101", left: "80%", duration: "14s", delay: "0.9s"  },
  { chars: "EXPLOIT_ZERO_DAY_PATCHED_KERNEL_CLEAN_OK", left: "87%", duration: "9s",  delay: "3.5s"  },
  { chars: "01001101ﾊﾌﾎﾐﾒﾔﾖ01010101シェル010011", left: "93%", duration: "12s", delay: "2.3s"  },
];

export const INIT_LINES = [
  "> initializing ghost_shell...",
  "> kernel: Linux 6.1.0-ghost #1 SMP x86_64",
  "> system: ONLINE",
  "> scanning: 127.0.0.1...",
  "> threat level: NOMINAL",
  "> ACCESS GRANTED",
];

export const MODULES = [
  {
    id: "module_01.sh",
    name: "exploit_design",
    tag: "OFFENSIVE",
    synopsis: "craft zero-trust interfaces that anticipate breach vectors before adversaries do",
    config: [
      "type:       UI/UX Engineering",
      "stack:      React · Next.js · WebGL",
      "threat_mod: enabled",
      "zero_trust: true",
    ],
  },
  {
    id: "module_02.sh",
    name: "zero_day_dev",
    tag: "CRITICAL",
    synopsis: "full-stack development pipelines with security-first architecture and automated pen-test loops",
    config: [
      "type:       Full-Stack Development",
      "stack:      Node · Rust · Postgres",
      "ci_scan:    trivy · semgrep · snyk",
      "cve_watch:  true",
    ],
  },
  {
    id: "module_03.sh",
    name: "ghost_protocol",
    tag: "CLASSIFIED",
    synopsis: "anonymous deployment workflows — no trace, no fingerprint, maximum operational security",
    config: [
      "type:       DevSecOps",
      "stack:      K8s · Terraform · Vault",
      "anonymity:  high",
      "log_purge:  auto",
    ],
  },
];

export const OPERATIONS = [
  { date: "2026-04-11", perms: "drwxr-x---", size: "4.2M", name: "project_nightfall/",   desc: "adversarial ML sandbox" },
  { date: "2026-03-28", perms: "-rwx------", size: "891K", name: "kernel_ghost.sh",       desc: "kernel-level rootkit sim" },
  { date: "2026-02-14", perms: "drwxr-x---", size: "12M",  name: "redteam_atlas/",        desc: "red team ops dashboard" },
  { date: "2025-12-01", perms: "-rwxr-x---", size: "2.1M", name: "zero_day_scanner.py",   desc: "CVE exploit surface map" },
  { date: "2025-10-17", perms: "drwx------", size: "7.8M", name: "phantom_proxy/",        desc: "TOR-layer routing mesh" },
  { date: "2025-08-03", perms: "-rw-r-----", size: "340K", name: "ghostchain.sol",        desc: "on-chain identity vault" },
];

export const NAV_LINKS = [
  { label: "> work", href: "/templates/impact-55/work" },
  { label: "> about", href: "/templates/impact-55/about" },
  { label: "> contact", href: "/templates/impact-55/contact" },
] as const;

// ── BLINK CURSOR ──────────────────────────────────────────────────────────────
export function BlinkCursor() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{ color: "#00FF41", visibility: visible ? "visible" : "hidden" }}>█</span>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────
export function ProgressBar({ pct, label, value }: { pct: number; label: string; value: string }) {
  const filled = Math.round((pct / 100) * 20);
  const empty = 20 - filled;
  return (
    <div style={{ marginBottom: "20px", fontFamily: "'Courier New', Courier, monospace" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ color: "#008F11", fontSize: "11px", letterSpacing: "0.12em" }}>{label}</span>
        <span style={{ color: "#00FF41", fontSize: "11px", letterSpacing: "0.08em" }}>{value}</span>
      </div>
      <div style={{ color: "#00FF41", fontSize: "13px", letterSpacing: "2px" }}>
        {"█".repeat(filled)}
        {"░".repeat(empty)}
      </div>
    </div>
  );
}

// ── TERMINAL WINDOW ───────────────────────────────────────────────────────────
export function TerminalWindow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      border: "1px solid #008F11",
      borderRadius: "4px",
      overflow: "hidden",
      backgroundColor: "#000",
    }}>
      <div style={{
        backgroundColor: "#001a00",
        borderBottom: "1px solid #008F11",
        padding: "8px 14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}>
        <span style={{ color: "#ff5f57", fontSize: "10px" }}>●</span>
        <span style={{ color: "#febc2e", fontSize: "10px" }}>●</span>
        <span style={{ color: "#28c840", fontSize: "10px" }}>●</span>
        <span style={{
          marginLeft: "12px",
          color: "#008F11",
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: "11px",
          letterSpacing: "0.08em",
        }}>{title}</span>
      </div>
      <div style={{ padding: "24px" }}>{children}</div>
    </div>
  );
}

// ── GLOBAL STYLES ─────────────────────────────────────────────────────────────
export const GLOBAL_STYLES = `
  @keyframes code-rain {
    0%   { transform: translateY(-100%); opacity: 1; }
    85%  { opacity: 0.6; }
    100% { transform: translateY(100vh); opacity: 0; }
  }
  @keyframes blink-cursor {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0; }
  }
  @keyframes scanline {
    0%   { transform: translateY(-100%); }
    100% { transform: translateY(100vh); }
  }
  .gs-scanline {
    position: fixed;
    left: 0; right: 0;
    height: 2px;
    background: linear-gradient(transparent, rgba(0,255,65,0.08), transparent);
    pointer-events: none;
    z-index: 1;
    animation: scanline 6s linear infinite;
  }
`;

export function StyleInjector() {
  useEffect(() => {
    const existing = document.getElementById("impact-55-styles");
    if (existing) return;
    const tag = document.createElement("style");
    tag.id = "impact-55-styles";
    tag.textContent = GLOBAL_STYLES;
    document.head.appendChild(tag);
    return () => {
      const el = document.getElementById("impact-55-styles");
      if (el) el.remove();
    };
  }, []);
  return null;
}
