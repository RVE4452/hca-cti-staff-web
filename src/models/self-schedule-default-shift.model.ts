

export interface SelfScheduleDefaultShift 
{
     id: string
     facilityId: number;
     coid: string;
     facilityName: string;
     departmentId: number;
     departmentName: string;
     departmentCode: string;
     departmentShiftId: number;
     shiftCode: string;
     shiftDescription: string;
     skillId: number;
     skill: string;
     date: Date;
     startTime: Date;
     endTime: Date;
     dayOfSchedule: number;
     actualStartTime: string;
     actualEndTime: string;
     productiveType: string;
    // Unavailable // TBD for this release

}
