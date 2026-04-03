import axios from "axios";

import type {
  DashboardStats,
  FloatRecord,
  NetcdfUploadResponse,
  ProfileRecord,
} from "@/lib/types";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function fetchFloats() {
  const response = await api.get<FloatRecord[]>("/floats");
  return response.data;
}

export async function fetchProfiles() {
  const response = await api.get<ProfileRecord[]>("/profiles");
  return response.data;
}

export async function fetchStats() {
  const response = await api.get<DashboardStats>("/stats");
  return response.data;
}

export async function uploadNetcdf(
  file: File,
  onProgress?: (progress: number) => void,
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<NetcdfUploadResponse>("/upload-netcdf", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (event) => {
      if (!event.total) {
        return;
      }

      onProgress?.(Math.round((event.loaded / event.total) * 100));
    },
  });

  return response.data;
}
