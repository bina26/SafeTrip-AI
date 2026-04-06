/**
 * cloudinaryUpload.ts
 *
 * Uploads local audio evidence to Cloudinary using an Unsigned Upload Preset.
 * Unsigned presets are safe to expose in client-side code — no API secret is needed.
 *
 * Setup:
 *   1. Add  EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name  to your .env file.
 *   2. In your Cloudinary dashboard → Settings → Upload → Upload Presets:
 *      Create an unsigned preset named  safetrip_evidence  and restrict it
 *      to the  video  resource type (Cloudinary handles audio via /video).
 */

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = 'safetrip_evidence';

export interface CloudinaryUploadResult {
  secureUrl: string;
  publicId: string;
  duration: number | null;
}

/**
 * Uploads a local audio file to Cloudinary and returns the public secure URL.
 * @param localUri - The on-device file URI returned by expo-av after recording.
 */
export async function uploadEvidence(
  localUri: string
): Promise<CloudinaryUploadResult> {
  if (!CLOUD_NAME) {
    throw new Error(
      '[cloudinaryUpload] EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in your .env file.'
    );
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  // Build the multipart form payload
  const formData = new FormData();
  formData.append('file', {
    uri: localUri,
    type: 'audio/m4a',
    name: 'emergency_log.m4a',
  } as unknown as Blob); // React Native FormData accepts this shape
  formData.append('upload_preset', UPLOAD_PRESET);

  const response = await fetch(endpoint, {
    method: 'POST',
    body: formData,
    // Do NOT set Content-Type manually — fetch must set the boundary for multipart
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `[cloudinaryUpload] Upload failed (${response.status}): ${errorBody}`
    );
  }

  const json = await response.json();

  return {
    secureUrl: json.secure_url as string,
    publicId: json.public_id as string,
    duration: (json.duration as number) ?? null,
  };
}
