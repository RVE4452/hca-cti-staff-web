
export interface SMSPreferences {
     id: string;
     username: string;
     isUserOptedIn: boolean;
     mobileNumber: string;
     validated: boolean;
     validatedDate: Date | null;
     callBeforeText: boolean;
     callNumber: string;
     activationCode: string;
     activationCodeExpiresUtc: Date;
    
     assignmentCreated: boolean;
     assignmentModified: boolean;
     assignmentCanceled: boolean;
     staffingNeed: boolean;
     staffingNeedCriticalPay: boolean;
}

