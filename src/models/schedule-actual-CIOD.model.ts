import {CIOD} from './CIOD.model';

export interface ScheduleActualCIOD {

     departmentId: number;
     departmentCode: string;
     departmentName: string;    
     start: Date;
     end: Date;
     shiftCode: string;
     clockInOuts: CIOD[];
} 
