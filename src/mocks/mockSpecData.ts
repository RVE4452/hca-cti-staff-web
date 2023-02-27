export const staff = {
    "staffId": 29,
    "username": "ADT4201",
    "firstName": "Test",
    "lastName": "Staff1",
    "email": "ADT4201@hca.corpad.net",
    "phone": "",
    "weeksInSchedule": 4,
    "facilityId": 9,
    "coid": "11111",
    "facilityName": "Mock Facility",
    "departmentCode": "22222",
    "departmentName": "Test Dept",
    "staffType": "Core",
    "partOfDay": "Day",
    "createdBy": "SYSADMN",
    "created": "2023-02-06T22:01:25.9933333",
    "updatedBy": "SYSADMN",
    "updated": "2023-02-06T22:01:25.9933333",
    "schedules": [
        {
            "departmentId": 9,
            "start": "2022-12-04T07:00:00",
            "end": "2022-12-31T07:00:00",
            "status": "Posted",
            "scheduleId": 14,
            "facilityId": 9,
            "coid": "11111",
            "facilityName": "Mock Facility",
            "departmentCode": "22222",
            "departmentName": "Test Dept",
            "createdBy": "SYSADMN",
            "created": "2023-02-06T22:01:25.9833333",
            "updatedBy": "SYSADMN",
            "updated": "2023-02-06T22:01:25.9833333"
        }
    ],
    "userId": 0,
    "departmentId": 9,
    "staffTypeId": 20,
    "partOfDayId": 7,
    "fte": 0.90,
    "ptoBalance": 40.51,
    "start": "0001-01-01T00:00:00",
    "end": "0001-01-01T00:00:00",
    "rate": 5.99,
    "proficiency": 1,
    "address1": "Test Address 1",
    "address2": "Test Address 2",
    "city": "Test City",
    "state": "TN",
    "zip": "12345"
};

export const departmentSchedulesNew = {
    "departmentId": 9,
    "start": "2023-01-29T07:00:00",
    "end": "2023-02-25T07:00:00",
    "status": "Closed",
    "scheduleId": 16,
    "facilityId": 9,
    "coid": "11111",
    "facilityName": "Mock Facility",
    "departmentCode": "22222",
    "departmentName": "Test Dept",
    "createdBy": "SYSADMN",
    "created": "2023-02-06T22:01:25.9833333",
    "updatedBy": "SYSADMN",
    "updated": "2023-02-06T22:01:25.9833333",
    "staff": [
        {
            "staffId": 0,
            "username": "ADT4201",
            "firstName": "Test",
            "lastName": "Staff1",
            "skills": [
                "CNC"
            ],
            "staffType": "Core",
            "fte": 0.90,            
            "assignments": [
                {
                    "assigmentId": 105,
                    "staffId": 29,
                    "departmentShiftCode": "A",
                    "start": "2023-02-01T07:00:00",
                    "end": "2023-02-01T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 106,
                    "staffId": 29,
                    "departmentShiftCode": "A",
                    "start": "2023-02-02T07:00:00",
                    "end": "2023-02-02T19:00:00",
                    "hours": 12
                }
            ]
        },
        {
            "staffId": 0,
            "username": "ADT4202",
            "firstName": "Test",
            "lastName": "Staff2",
            "skills": [
                "RN"
            ],
            "staffType": "Core",
            "fte": 0.90,
            "schedulePreferences": [],
            "assignments": [
                {
                    "assigmentId": 119,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-01-30T07:00:00",
                    "end": "2023-01-30T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 120,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-01T07:00:00",
                    "end": "2023-02-01T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 121,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-03T07:00:00",
                    "end": "2023-02-03T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 122,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-05T07:00:00",
                    "end": "2023-02-05T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 123,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-09T07:00:00",
                    "end": "2023-02-09T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 124,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-10T07:00:00",
                    "end": "2023-02-10T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 125,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-12T07:00:00",
                    "end": "2023-02-12T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 126,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-13T07:00:00",
                    "end": "2023-02-13T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 127,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-16T07:00:00",
                    "end": "2023-02-16T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 128,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-20T07:00:00",
                    "end": "2023-02-20T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 129,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-21T07:00:00",
                    "end": "2023-02-21T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 130,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-22T07:00:00",
                    "end": "2023-02-22T19:00:00",
                    "hours": 12
                },
                {
                    "assigmentId": 131,
                    "staffId": 30,
                    "departmentShiftCode": "A",
                    "start": "2023-02-25T07:00:00",
                    "end": "2023-02-25T19:00:00",
                    "hours": 12
                }
            ]
        },
    ],
    "scheduleBlocks": [
        {
            "startTime": "07:00:00",
            "endTime": "11:00:00",
            "description": "7A - 11A"
        },
        {
            "startTime": "11:00:00",
            "endTime": "15:00:00",
            "description": "11A - 3P"
        },
        {
            "startTime": "15:00:00",
            "endTime": "19:00:00",
            "description": "3P - 7P"
        },
        {
            "startTime": "19:00:00",
            "endTime": "23:00:00",
            "description": "7P - 11P"
        },
        {
            "startTime": "23:00:00",
            "endTime": "03:00:00",
            "description": "11P - 3A"
        },
        {
            "startTime": "03:00:00",
            "endTime": "07:00:00",
            "description": "3A - 7A"
        }
    ]
}

export const currentEvent = {
    id:"bed1116d-cd91-41b9-bc60-edb0c42596b4",
    type:"Need",
    status:"1 Needs",
    shiftCode:"",
    description:"01/08/2023 00:00:00,02/04/2023 00:00:00",
    date:"2023-01-30T00:00:00",
    hours:0,
    minutes:0,
    isWeekend:true,
    dailyEvents:2,
    changed:false,
    facilityId:0,
    facilityCoId:null,
    facilityName:null,
    departmentId:0,
    departmentName:null,
    departmentCode:null,
    isCommitment:false,
    isSelfScheduled:false,
    hasEventSelfScheduleNeedsInPrimaryDept:false,
    selfScheduleDepartments:null,
    isOvertime:false,
    actualStartTime:null,
    actualEndTime:null,
    productiveType:null,
    premiumLaborLevel:false,
    dailyEventsType:["Assignment","Need"],
    isTradableShift:false,
    assignmentId:"bb0598f8-867b-4a36-9af7-e22a37538be1"
    
};

export const resOpenNeedData = [
    {
       "staffId":89,
       "facilityId":15,
       "coid":"11111",
       "facilityName":"Mock Facility",
       "departmentId":15,
       "departmentCode":"22222",
       "departmentName":"Test Dept",
       "skillId":89,
       "skill":"RN",
       "start":"2023-02-19T07:00:00",
       "end":"2023-02-19T11:00:00",
       "departmentShiftId":"639",
       "shiftCode":"P",
       "description":"P 7:00 am - 11:00 am",
       "key":"P 7:00 am - 11:00 am-639",
       "id":"P 7:00 am - 11:00 am-639"
    },
    {
       "staffId":89,
       "facilityId":15,
       "coid":"11111",
       "facilityName":"Mock Facility",
       "departmentId":15,
       "departmentCode":"22222",
       "departmentName":"Test Dept",
       "skillId":89,
       "skill":"RN",
       "start":"2023-02-19T11:00:00",
       "end":"2023-02-19T15:00:00",
       "departmentShiftId":"639",
       "shiftCode":"P",
       "description":"P 11:00 am - 3:00 pm",
       "key":"P 11:00 am - 3:00 pm-639",
       "id":"P 11:00 am - 3:00 pm-639"
    }
 ]

