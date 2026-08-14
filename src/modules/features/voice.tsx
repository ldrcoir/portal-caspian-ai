"use client";

import { useState, useRef } from "react";
import { Mic, Volume2, Play, Pause, Upload, Coins, AudioLines } from "lucide-react";
import { useAppStore, formatToman, formatRelativeTime } from "@/store/app-store";
import { GlassCard } from "@/components/caspian/GlassCard";
import { GlowButton } from "@/components/caspian/GlowButton";
import { toast } from "sonner";
import type { ModuleManifest } from "../registry";

const STT_COST = 1000;
const TTS_COST = 1500;

export function VoiceView() {
  const { user, voiceTranscriptions, addVoiceTranscription } = useAppStore();
  const [tab, setTab] = useState<"stt" | "tts">("stt");
  const [recording, setRecording] = useState(false);
  const [audioFile, setAudioFile] = useState<string>("");
  const [transcript, setTranscript] = useState("");
  const [ttsText, setTtsText] = useState("");
  const [ttsAudio, setTtsAudio] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  if (!user) return null;
  const userTranscripts = voiceTranscriptions.filter((t) => t.userId === user.id);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const reader = new FileReader();
        reader.onload = () => setAudioFile(reader.result as string);
        reader.readAsDataURL(blob);
      };
      recorder.start();
      mediaRef.current = recorder;
      setRecording(true);
    } catch {
      toast.error("دسترسی به میکروفون ممکن نشد");
    }
  };

  const stopRecording = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  const handleTranscribe = () => {
    if (!audioFile) { toast.error("ابتدا صدا را ضبط یا آپلود کنید"); return; }
    if (user.creditBalance < STT_COST) { toast.error("موجودی کافی نیست"); return; }
    setProcessing(true);
    setTimeout(() => {
      const mockTranscript = "این یک متن نمونه است که از تبدیل صوت به متن تولید شده. در محیط واقعی، این متن توسط مدل Whisper تولید می‌شود.";
      addVoiceTranscription({ userId: user.id, audioFileName: "recorded.webm", transcript: mockTranscript, modelId: "whisper-1", duration: 10, cost: STT_COST });
      setTranscript(mockTranscript);
      setProcessing(false);
      toast.success("تبدیل کامل شد");
    }, 1500);
  };

  const handleSynthesize = () => {
    if (!ttsText.trim()) { toast.error("متن الزامی است"); return; }
    if (user.creditBalance < TTS_COST) { toast.error("موجودی کافی نیست"); return; }
    setProcessing(true);
    setTimeout(() => {
      // Mock: generate a silent audio data URL
      setTtsAudio(`data:audio/wav;base64,${btoa("mock-audio-" + Date.now())}`);
      setProcessing(false);
      toast.success("صدا تولید شد");
    }, 1500);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-foreground flex items-center gap-2">
          <Mic className="h-7 w-7 text-amber-400" />
          صدا و گفتار
        </h1>
        <p className="text-sm text-muted-foreground mt-1">تبدیل صوت به متن و متن به صوت</p>
      </div>

      <div className="flex items-center gap-1 p-1 rounded-xl bg-white/5 w-fit">
        <button onClick={() => setTab("stt")} className={`h-9 px-4 rounded-lg text-sm font-semibold flex items-center gap-2 ${tab === "stt" ? "bg-amber-400/15 text-amber-300" : "text-muted-foreground"}`}>
          <Mic className="h-4 w-4" /> صوت به متن
        </button>
        <button onClick={() => setTab("tts")} className={`h-9 px-4 rounded-lg text-sm font-semibold flex items-center gap-2 ${tab === "tts" ? "bg-amber-400/15 text-amber-300" : "text-muted-foreground"}`}>
          <Volume2 className="h-4 w-4" /> متن به صوت
        </button>
      </div>

      {tab === "stt" ? (
        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-foreground">ضبط یا آپلود صدا</h3>
            <div className="flex items-center justify-center p-8 rounded-xl border-2 border-dashed border-white/10">
              {recording ? (
                <GlowButton variant="primary" onClick={stopRecording} className="!bg-red-500">
                  <span className="h-3 w-3 rounded-full bg-white animate-pulse" /> توقف ضبط
                </GlowButton>
              ) : (
                <GlowButton variant="primary" onClick={startRecording}>
                  <Mic className="h-4 w-4" /> شروع ضبط
                </GlowButton>
              )}
            </div>
            {audioFile && (
              <div className="space-y-2">
                <audio src={audioFile} controls className="w-full" />
                <div className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                  <span className="text-xs text-muted-foreground">هزینه: {formatToman(STT_COST)}</span>
                  <GlowButton variant="primary" size="sm" onClick={handleTranscribe} disabled={processing}>
                    {processing ? "در حال تبدیل..." : "تبدیل به متن"}
                  </GlowButton>
                </div>
              </div>
            )}
            {transcript && (
              <div className="rounded-xl bg-amber-400/5 border border-amber-400/15 p-3">
                <div className="text-xs font-semibold text-amber-400 mb-1">متن تبدیل‌شده:</div>
                <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
              </div>
            )}
          </GlassCard>

          <GlassCard className="space-y-4">
            <h3 className="font-bold text-foreground">تاریخچه</h3>
            {userTranscripts.length === 0 ? (
              <div className="text-center py-8"><AudioLines className="mx-auto h-10 w-10 text-muted-foreground/50 mb-2" /><p className="text-sm text-muted-foreground">موردی وجود ندارد</p></div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {userTranscripts.map((t) => (
                  <div key={t.id} className="rounded-lg glass p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-foreground">{t.audioFileName}</span>
                      <span className="text-[10px] text-muted-foreground">{formatRelativeTime(t.createdAt)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{t.transcript}</p>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-foreground">متن به صوت</h3>
            <textarea value={ttsText} onChange={(e) => setTtsText(e.target.value)} rows={5} placeholder="متن خود را بنویسید..." className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder:text-muted-foreground focus:border-amber-400/50 focus:outline-none text-sm resize-none" />
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
              <span className="text-xs text-muted-foreground">هزینه: {formatToman(TTS_COST)}</span>
              <GlowButton variant="primary" onClick={handleSynthesize} disabled={processing}>
                {processing ? "در حال تولید..." : <><Volume2 className="h-4 w-4" /> تولید صدا</>}
              </GlowButton>
            </div>
            {ttsAudio && (
              <div className="rounded-xl bg-amber-400/5 border border-amber-400/15 p-3">
                <div className="text-xs font-semibold text-amber-400 mb-2">صدا تولید شد:</div>
                <audio src={ttsAudio} controls className="w-full" />
              </div>
            )}
          </GlassCard>
          <GlassCard className="space-y-4">
            <h3 className="font-bold text-foreground">اطلاعات</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between p-2 rounded-lg bg-white/5"><span className="text-muted-foreground">مدل:</span><span className="text-foreground">OpenAI TTS-1</span></div>
              <div className="flex justify-between p-2 rounded-lg bg-white/5"><span className="text-muted-foreground">فرمت خروجی:</span><span className="text-foreground">MP3</span></div>
              <div className="flex justify-between p-2 rounded-lg bg-white/5"><span className="text-muted-foreground">زبان‌های پشتیبانی:</span><span className="text-foreground">فارسی، انگلیسی</span></div>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}

export const voiceModule: ModuleManifest = {
  id: "feature-voice", name: "ماژول صدا و گفتار", description: "تبدیل صوت به متن (STT) و متن به صوت (TTS) با مدل‌های Whisper و TTS.", version: "1.0.0", author: "Caspian AI Team", icon: "Mic", type: "feature", isEnabled: true, isCore: false,
  config: { sttCost: 1000, ttsCost: 1500 },
  configSchema: [
    { key: "sttCost", label: "هزینه STT (تومان)", type: "number", defaultValue: 1000 },
    { key: "ttsCost", label: "هزینه TTS (تومان)", type: "number", defaultValue: 1500 },
  ],
  navItems: [{ id: "voice", label: "صدا و گفتار", icon: "Mic", view: "voice-stt", order: 90 }],
  onEnable: () => console.log("[Voice] enabled"),
  onDisable: () => console.log("[Voice] disabled"),
};
