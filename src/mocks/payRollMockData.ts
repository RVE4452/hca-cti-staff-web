import { ScheduleActualCIOD } from "@/models";

export const payRollMockData = [
    {
        "departmentId": 34024,
        "departmentCode": "61007",
        "departmentName": "CTU (3F) 2330",
        "start": "2023-01-02T07:00:00",
        "end": "2023-01-02T17:00:00",
        "shiftCode": "T7",
        "clockInOuts": [
            {
                "departmentId": 34024,
                "departmentCode": "61007",
                "departmentName": "CTU (3F) 2330",
                "inDateTime": "2023-01-02T07:06:00",
                "outDateTime": "2023-01-02T12:30:00",
                "code": " PROD"
            },
            {
                "departmentId": 34024,
                "departmentCode": "61007",
                "departmentName": "CTU (3F) 2330",
                "inDateTime": "2023-01-02T13:00:00",
                "outDateTime": "2023-01-02T17:03:00",
                "code": " PROD"
            }
        ]
    }
    
]

export const profileData = {
    "username": "RVE4452",
    "tenantUrl": "https://api-dev.internal.medcity.net/",
    
}