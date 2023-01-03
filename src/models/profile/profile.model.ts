export interface Profile {
    TenantId: string;
    TenantName: string;
    ApiUrl: string; 
    AppUrl: string;
    UserName: string; 
    DashboardId: string; 
    UserId: number; 
    StaffingExceptionView: boolean; 
    FacilityId: number; 
    PlusMetricEnabled: boolean;
    IsSurgeAlertFeatureEnabled: boolean;
    ContractLaborEnabled: boolean; 
    ForecastCensusEditEnabled: boolean;
    ManageCensusEnabled: boolean;
    CensusEditEnabled: boolean;
    UserNotificationEnabled: boolean;
    ContractLaborUsingKafkaEnabled: boolean;
    ContractLaborBulkCreateEnabled: boolean;
    DashboardDailyRosterPrint: boolean;
    ContractLaborNeedAutomation: boolean;
    Permissions: string[]
}