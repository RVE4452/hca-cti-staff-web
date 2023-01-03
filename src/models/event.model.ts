
import {Case} from './case.model';

export interface Event {
     id: string;
     type: string;
     status: string;
     description: string;
     changed: boolean;
     isWeekend: boolean;
     assignmentId: string;
     needId: string;
     requestId: string;
     requestShiftId: number;
     dailyEvents: number;    
     facilityId: number;
     coid: string;
     facilityName: string;
     facilityCoId: string;
     departmentId: number;
     departmentName: string;
     departmentCode: string;
     departmentShiftId: number;
     shiftCode: string;
     shiftDescription: string;
     skillId: number;
     skill: string;
     productiveTypeId: number;
     productiveType: string;
     date: Date;
     startTime: Date;
     endTime: Date;
     actualStartTime: Date;
     actualEndTime: Date;
     hours: number;
     minutes: number;
     comment: string;
     cases: Case[];
     isCommitment: boolean;
     isSelfScheduled: boolean;
     isOvertime: boolean;
     premiumLaborLevel: boolean;
     dailyEventsType: string[];  
}