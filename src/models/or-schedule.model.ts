import {Event} from "./event.model";

export interface ORSchedule {
     id: string;
     username: string;
     staffId: string;
     tenantId: string;
     startDate: Date;
     endDate: Date;
     status: string;
     current: true;
     facilityId: string;
     coid: string;
     facilityName: string;
     deptId: string;
     deptCode: string;
     deptName: string;
     events: Event[];
}