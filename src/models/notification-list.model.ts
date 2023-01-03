
export interface NotificationList {
    id: string;
    username: string;
    tenantId: string;
    staffId: number;
    message: string;
    body: string;
    read: boolean;
    urgent: boolean;
    actionableBy: string;
  }