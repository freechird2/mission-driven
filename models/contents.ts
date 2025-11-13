export interface SessionContent {
  date?: string;
  startMeridiem: 'am' | 'pm';
  startTimeHour: string;
  startTimeMinute: string;
  endMeridiem: 'am' | 'pm';
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
