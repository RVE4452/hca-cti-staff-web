import {DepartmentAssignment} from './department-assignment.model';

export interface Staff {
   staffId: number;
   firstName: string;
   lastName: string;
   skill: any[];
   charge: boolean;
   assignments: DepartmentAssignment[];
   staffType: string;
   fte: string;
   weeklyCommitments: any[];
   schedulePreferences: any[];
}