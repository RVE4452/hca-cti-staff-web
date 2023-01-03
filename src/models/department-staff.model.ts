

import {DepartmentAssignment} from './department-assignment.model';

export interface DepartmentStaff {
    
   staffId: number;
   firstName: string;
   lastName: string;
   skill: string;
   charge: boolean;
   assignments: DepartmentAssignment[];
}