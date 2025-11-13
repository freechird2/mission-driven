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
  sessions: SessionContent[];
  activityType: 'online' | 'offline' | null;
  mainImage: File | null;
  additionalImages: File[];
}
