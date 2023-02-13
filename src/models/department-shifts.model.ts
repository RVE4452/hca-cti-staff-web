export interface DepartmentShifts{
   departmentId: number;
   code: string;
   description: string;
   productive: boolean;
   request: boolean;
   start: string;
   end: string;
   enabled: boolean;
   departmentShiftId: number;
   facilityId: number
   created: Date;
   updated: Date;
}