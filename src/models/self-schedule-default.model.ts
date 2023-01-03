
import {SelfScheduleDefaultShift} from './self-schedule-default-shift.model';

export interface SelfScheduleDefault {
     id: string;
     username: string;
     tenantId: string;
     staffId: number;
     first: string;
     last: string;
     hasDefaultSelfScheduleApplied: boolean;
     defaultSelfScheduleAppliedDate: Date;
     defaultShifts : SelfScheduleDefaultShift[];
}
