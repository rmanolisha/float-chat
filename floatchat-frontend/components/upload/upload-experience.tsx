"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileUp, LoaderCircle, UploadCloud } from "lucide-react";
import axios from "axios";

import { uploadNetcdf } from "@/lib/api";
import { useToast } from "@/components/providers/toast-provider";
import { GlassCard } from "@/components/ui/glass-card";

export function UploadExperience() {
  const { pushToast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<string | null>(null);

  async function handleUpload() {
    if (!selectedFile) {
      pushToast({
        title: "No file selected",
        description: "Choose a NetCDF file before starting the upload.",
        tone: "error",
      });
      return;
    }

    setUploading(true);
    setProgress(0);
    setResult(null);

    try {
      const response = await uploadNetcdf(selectedFile, setProgress);
      setResult(
        `${response.profiles_created} profiles and ${response.measurements_created} measurements ingested.`,
      );
      pushToast({
        title: "Upload complete",
        description: `${selectedFile.name} was processed successfully.`,
        tone: "success",
      });
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.detail as string | undefined) ?? error.message
        : "Upload failed";
      pushToast({
        title: "Upload failed",
        description: message,
        tone: "error",
      });
      setResult(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <GlassCard className="p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-3xl bg-white/[0.06] p-4 text-cyan-100">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/65">Ingestion pipeline</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Upload NetCDF profile files</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
              Send valid ARGO `.nc` or `.nc4` files into the backend ingestion service and monitor live upload progress.
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-[28px] border border-dashed border-cyan-300/20 bg-white/[0.035] p-6">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-4 rounded-[24px] border border-white/10 bg-slate-950/25 px-6 py-12 text-center transition hover:border-cyan-300/20 hover:bg-cyan-300/8">
            <FileUp className="h-10 w-10 text-cyan-100" />
            <div>
              <p className="text-lg font-semibold text-white">Drop a NetCDF file here</p>
              <p className="mt-2 text-sm text-white/55">or click to browse `.nc` and `.nc4` assets</p>
            </div>
            <input
              type="file"
              accept=".nc,.nc4"
              className="hidden"
              onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
            />
          </label>

          {selectedFile ? (
            <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm text-white/75">
              Selected file: <span className="font-semibold text-white">{selectedFile.name}</span>
            </div>
          ) : null}

          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-teal-300 to-sky-400"
                animate={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-white/55">
              <span>{uploading ? "Uploading to backend..." : "Ready to ingest"}</span>
              <span>{progress}%</span>
            </div>
          </div>

          <button
            onClick={handleUpload}
            disabled={uploading}
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-teal-300 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {uploading ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Uploading
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4" />
                Upload NetCDF
              </>
            )}
          </button>
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard className="p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-200/65">Processing status</p>
          <h3 className="mt-2 text-xl font-semibold text-white">Upload feedback</h3>
          <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.04] p-5">
            {result ? (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-200" />
                <p className="text-sm leading-7 text-white/75">{result}</p>
              </div>
            ) : (
              <p className="text-sm leading-7 text-white/55">
                Successful uploads will report ingestion totals and appear immediately in the dashboard and map views.
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
