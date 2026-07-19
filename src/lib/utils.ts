export function formatKes(amount: number): string {
  return "KSh " + new Intl.NumberFormat("en-KE").format(Math.round(amount));
}

export const KENYA_REGIONS = [
  "Nairobi",
  "Mombasa",
  "Kisumu",
  "Nakuru",
  "Eldoret",
  "Meru",
  "Nyeri",
  "Machakos",
  "Kiambu",
  "Kakamega",
  "Kisii",
  "Thika",
  "Malindi",
  "Garissa",
  "Other",
];

export const MAX_IMAGES = 3;
export const MAX_VIDEO_BYTES = 1 * 1024 * 1024; // 5MB
export const MAX_IMAGE_BYTES = 1 * 1024 * 1024; // 5MB per image
