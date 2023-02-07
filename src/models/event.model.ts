
export interface Event {
     id: number;
     type: string;
     status: string;
     description: string;
     assignmentId: number;
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
}