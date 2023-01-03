import {DayOfWeekPreferences} from './dow-preferences.model';

export interface SchedulingPreferences {
     id: string;
     username: string;
     tenantId: string;
     employeeName: string;
     staffId: number;
     selfScheduling: boolean;
     marketFloat: boolean;
     daysOfWeek: DayOfWeekPreferences[];
     shiftPattern: number;
}


