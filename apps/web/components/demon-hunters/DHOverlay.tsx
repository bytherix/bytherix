"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, Terminal, Users, Trophy, ExternalLink } from "lucide-react";
import { TerminalText } from "./TerminalText";
import Link from "next/link";

interface DHOverlayProps {
  open: boolean;
  onClose: () => void;
}

const team = [
  { handle: "r00tkit", role: "Team Lead · Web Exploitation", rank: "#1" },
  { handle: "ph4ntom", role: "Reverse Engineering · Pwn", rank: "#2" },
  { handle: "cr4ck3r", role: "Cryptography · Forensics", rank: "#3" },
  { handle: "n3tw0rk", role: "Network Pentesting · OSINT", rank: "#4" },
  { handle: "gh0stly", role: "Steganography · Malware Analysis", rank: "#5" },
];

const achievements = [
  { event: "National CTF 2024", placement: "2nd Place", points: 4200 },
  { event: "HackTheBox Pro Labs", placement: "Completed", points: 3800 },
  { event: "RS Internal CTF", placement: "Champions", points: 5000 },
];

export function DHOverlay({ open, onClose }: DHOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] bg-black"
          role="dialog"
          aria-modal="true"
          aria-label="Demon Hunters Cyber Security Team"
        >
          {/* Scanline effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.015) 2px, rgba(0,255,0,0.015) 4px)",
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,255,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,0,0.1) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-md transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="relative h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto px-4 py-12">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-12"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Shield className="w-10 h-10 text-red-500" />
                  <h1 className="text-4xl sm:text-5xl font-mono font-bold text-green-400 tracking-widest uppercase">
                    DEMON_HUNTERS
                  </h1>
                  <Shield className="w-10 h-10 text-red-500" />
                </div>

                <div className="font-mono text-green-600 text-sm mb-4 tracking-wider">
                  <TerminalText
                    texts={[
                      "Cyber Security Division of Bytherix",
                      "Hack. Defend. Repeat.",
                      "CTF Champions. Penetration Testers.",
                    ]}
                  />
                </div>

                <div className="inline-block border border-green-800 bg-green-950/30 rounded px-4 py-2">
                  <span className="font-mono text-green-500 text-xs">
                    STATUS:{" "}
                    <span className="text-green-300 animate-pulse">
                      ● ACTIVE
                    </span>
                    &nbsp;&nbsp;MEMBERS:{" "}
                    <span className="text-green-300">5</span>
                    &nbsp;&nbsp;CTF_RANK:{" "}
                    <span className="text-yellow-400">#42 GLOBAL</span>
                  </span>
                </div>
              </motion.div>

              {/* Terminal intro */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-950 border border-green-900 rounded-lg p-4 mb-10 font-mono"
              >
                <div className="flex items-center gap-2 mb-3 border-b border-green-900 pb-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-green-700 text-xs ml-2">
                    demon-hunters@rs:~$
                  </span>
                </div>
                <div className="text-green-400 text-sm space-y-1">
                  <p>
                    <span className="text-green-600">$</span> whoami
                  </p>
                  <p className="text-green-300 pl-2">
                    → Elite cyber security team from Bytherix
                  </p>
                  <p>
                    <span className="text-green-600">$</span> cat mission.txt
                  </p>
                  <p className="text-green-300 pl-2">
                    → Train future ethical hackers. Compete in CTFs. Secure the
                    digital world.
                  </p>
                  <p>
                    <span className="text-green-600">$</span> ls ./skills/
                  </p>
                  <p className="text-green-300 pl-2">
                    → web_exploitation/ pwn/ crypto/ forensics/ osint/ rev_eng/
                  </p>
                  <p>
                    <span className="text-green-600">$</span>{" "}
                    <span className="terminal-cursor" />
                  </p>
                </div>
              </motion.div>

              {/* Team grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-10"
              >
                <h2 className="font-mono text-green-600 text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4" /> TEAM_ROSTER
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {team.map((member, i) => (
                    <motion.div
                      key={member.handle}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.07 }}
                      className="bg-gray-950 border border-green-900 hover:border-green-600 rounded-lg p-4 transition-colors group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="font-mono text-green-400 font-bold text-base group-hover:text-green-300 transition-colors">
                          {member.handle}
                        </span>
                        <span className="font-mono text-yellow-600 text-xs">
                          {member.rank}
                        </span>
                      </div>
                      <p className="font-mono text-green-700 text-xs">
                        {member.role}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Achievements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mb-10"
              >
                <h2 className="font-mono text-green-600 text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4" /> ACHIEVEMENTS
                </h2>
                <div className="space-y-2">
                  {achievements.map((a, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-950 border border-green-900 rounded px-4 py-3"
                    >
                      <span className="font-mono text-green-300 text-sm">
                        {a.event}
                      </span>
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-yellow-500 text-sm">
                          {a.placement}
                        </span>
                        <span className="font-mono text-green-700 text-xs">
                          {a.points} pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="text-center"
              >
                <Link
                  href="/training/cyber-security"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-mono font-bold px-8 py-3 rounded transition-colors"
                >
                  <Terminal className="w-5 h-5" />
                  JOIN_THE_HUNT
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <p className="font-mono text-green-800 text-xs mt-3">
                  Press ESC to exit secure zone
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
