
export interface UnavailabilityModel {

     staffAvailabilityId: number;
     staffId: number;
     tenantId: string;
     startDate: Date;
     endDate: Date;
     isUnavailable: boolean;
}