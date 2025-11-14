export interface SessionContent {
  date?: Date | null;
  startTimeHour: string;
  startTimeMinute: string;
  endTimeHour: string;
  endTimeMinute: string;
  activityContent: string;
}

export interface Contents {
  title: string;
  mainImage: File | null;
  mainImagePreview: string | null;
  additionalImages: File[];
  additionalImagesPreviews: string[];
  categoryIds: number[];
  activityType: 'online' | 'offline' | null;
  sessions: SessionContent[];
}
