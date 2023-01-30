export interface Staff {
    username: string
    staffId: number
    tenantId: string
    tenantName: string
    tenantUrl: string
    email: string
    first: string
    last: string
    birth: Date
    address1: string
    address2: string
    city: string
    state: string
    zip: string
    facilityId: number
    cOID: string
    facilityName: string
    deptId: number
    deptCode: string
    deptName: string
    employeeType: string
    workSchedule: string
    PTOBalance: number
    primaryShift: string
    isUnavailabilityAllowed: boolean
    maxUnavailableDays: number

    // public ICollection<DepartmentShift> DepartmentShifts { get; set; }

    // public ICollection<SecondaryDepartment> SecondaryDepartments { get; set; }

    // public ICollection<Skill> Skills { get; set; }
    homePhoneNumber: string
    weeksInSchedule: number
    profilePic: string
    staffAssignmentToSecondaryDepartments: string
    staffRequestOpenNeedsInSecondaryDepartments: string
    staffReceiveTradeAssignmentsInSecondaryDepartments: string
    secondaryStaffAssignmentToThisDepartment: string
    secondaryStaffSelfScheduleInThisDepartment: string
    secondaryStaffRequestOpenNeedsInThisDepartment: string
    secondaryStaffReceiveTradeAssignmentsInThisDepartment: string
    isFirstTimeLogin: boolean
    isAdmin: boolean
    isDisabled: boolean
    isStaffHasAdminAccount: boolean
    useMySchedulerOperatingRoom: boolean
    skill: string
    charge: boolean
}