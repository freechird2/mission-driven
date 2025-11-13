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
  additionalImages: File[];
  categoryIds: number[];
  activityType: 'online' | 'offline' | null;
  sessions: SessionContent[];
}
