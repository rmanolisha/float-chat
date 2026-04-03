export type FloatRecord = {
  id: number;
  platform_number: string;
  project_name: string | null;
  pi_name: string | null;
  created_at: string;
  updated_at: string;
};

export type ProfileRecord = {
  id: number;
  float_id: number;
  cycle_number: number | null;
  profile_time: string | null;
  latitude: number | null;
  longitude: number | null;
  source_file: string;
  created_at: string;
  float: FloatRecord;
  measurements: OceanMeasurementRecord[];
};

export type OceanMeasurementRecord = {
  id: number;
  pressure: number | null;
  temperature: number | null;
  salinity: number | null;
  latitude: number | null;
  longitude: number | null;
  measured_at: string | null;
  created_at: string;
};

export type DashboardStats = {
  total_floats: number;
  total_profiles: number;
  total_measurements: number;
};

export type NetcdfUploadResponse = {
  filename: string;
  float_id: number;
  profiles_created: number;
  measurements_created: number;
  vector_documents_created: number;
};

export type ToastTone = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone?: ToastTone;
};
