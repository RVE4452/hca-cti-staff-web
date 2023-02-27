

import { CancelReasons } from './cancel-reasons.model';
import { DepartmentShifts } from './department-shifts.model';
import { ScheduleBlocks } from './schedule-blocks.model';
import { Staff } from './staff.model';

export interface DepartmentStaff {
   departmentId:number;
   start: Date;
   end: Date;
   status: string;
   scheduleId: number;
   facilityId: number;
   coid: number;
   facilityName: string;
   departmentCode: number;
   departmentName: string;
   createdBy: string;
   created: Date;
   updatedBy: string;
   updated: Date;
   staff: Staff[];
   scheduleBlocks: ScheduleBlocks[];
   departmentShifts: DepartmentShifts[];
   cancelReasons: CancelReasons[];
   needs: any[];
}