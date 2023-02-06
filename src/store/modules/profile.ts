
import http from "@/store/axios";
import { Module, ActionTree, MutationTree } from 'vuex'
import { RootState } from "../types";
import { AxiosError, AxiosResponse } from "axios";
import { Staff, NotificationPreferences, SchedulingPreferences, SMSPreferences } from "@/models";
import router from '@/router';
//import bus from '../../../src/eventBus'

// import store from '@/store'
const namespaced = true

interface Profile {
     //STATE
    profileData: Staff,
    isAdmin: boolean,
    schedulingPrefData: any,
    notificationPrefData: any,
    smsPrefData: any,
    isImpersonating: boolean,
    impersonatingUser: string,
    appInsightEventData:any,
    isStaffManager: boolean
 }
 //state
const state: Profile = {
    profileData: {
        username: '',
        staffId: 0,
        tenantId: '',
        tenantName: '',
        tenantUrl: '',
        email: '',
        first: '',
        last: '',
        birth: new Date(),
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        facilityId: 0,
        cOID: '',
        facilityName: '',
        deptId: 0,
        deptCode: '',
        deptName: '',
        employeeType: '',
        workSchedule: '',
        PTOBalance: 0,
        primaryShift: '',
        isUnavailabilityAllowed: false,
        maxUnavailableDays: 0,
        homePhoneNumber: '',
        weeksInSchedule: 0,
        profilePic: '',
        staffAssignmentToSecondaryDepartments: '',
        staffRequestOpenNeedsInSecondaryDepartments: '',
        staffReceiveTradeAssignmentsInSecondaryDepartments: '',
        secondaryStaffAssignmentToThisDepartment: '',
        secondaryStaffSelfScheduleInThisDepartment: '',
        secondaryStaffRequestOpenNeedsInThisDepartment: '',
        secondaryStaffReceiveTradeAssignmentsInThisDepartment: '',
        isFirstTimeLogin: false,
        isAdmin: false,
        isDisabled: false,
        isStaffHasAdminAccount: false,
        useMySchedulerOperatingRoom: false,
        skill: '',
        charge: false
    },
    isAdmin: false,
    schedulingPrefData: null,
    notificationPrefData: null,
    smsPrefData:  null,
    isImpersonating: false,
    impersonatingUser:  '',
    appInsightEventData:{},
    isStaffManager: false
 }
 const mutations: MutationTree<Profile> = {
     setAppInsightEventData(state, profileData: any){
        let primarySkill = "";

        if (profileData.staffId > 0 && typeof profileData.skills !== "undefined") {
            for (let i = 0; i < profileData.skills.length; i++) {
                if (profileData.skills[i].primary === true) {
                    primarySkill = profileData.skills[i].description;
                    break;
                }
            }
        }

        state.appInsightEventData = {
            Username: profileData.username,
            TenantName: profileData.tenantName,
            FacilityName: profileData.facilityName,
            COID: profileData.coid,            
            DeptCode: profileData.deptCode,            
            DeptName: profileData.deptName,
            Skill: primarySkill
        };
    },

    // @Action
    // public updateAppInsightEventData(newData: string): void {
    //     this.context.commit('setAppInsightEventData', newData)
    // }
    
    
    setProfileData(state, payload: any): void {
        state.profileData = payload.newState;

        if (payload.userId.length > 0) {
            state.impersonatingUser = payload.userId;
            state.isImpersonating = true;
            state.isAdmin = true;
        }
        else {
            state.impersonatingUser = '';
            state.isImpersonating = false;

            if(state.profileData.isAdmin == true || state.profileData.isStaffHasAdminAccount == true)
            {
                state.isAdmin = true;
            }
        }

        //bus.$emit("profileLoaded", "");
    },

    setSchedulingPref(state, newState: SchedulingPreferences) {
        state.schedulingPrefData = newState;        
    },

    
    setNotificationPref(state, newState: NotificationPreferences) {
        state.notificationPrefData = newState;
    },

    
    setSMSPref(state, newState: SMSPreferences) {
        state.smsPrefData = newState;
    },

    
    setSMSPref_AfterActivateMobileNumber(state, expireDate: Date) {
        state.smsPrefData.activationCodeExpiresUtc = expireDate;
        state.smsPrefData.validated = false;
        state.smsPrefData.validatedDate = null;
    },

    
    setSMSPref_AfterValidateActivationCode(state, newState: SMSPreferences): void {
        state.smsPrefData.validated = newState.validated;
        state.smsPrefData.validatedDate = newState.validatedDate;
        state.smsPrefData.assignmentCreated = newState.assignmentCreated;
        state.smsPrefData.assignmentModified = newState.assignmentModified;
        state.smsPrefData.assignmentCanceled = newState.assignmentCanceled;
        state.smsPrefData.staffingNeed = newState.staffingNeed;
        state.smsPrefData.staffingNeedCriticalPay = newState.staffingNeedCriticalPay;
    },

    
    setWelcomePopupStatus(state) {
        state.profileData.isFirstTimeLogin = true;
    },
    
    setStaffManager(state, isStaffManager: boolean) {
        state.isStaffManager = isStaffManager;
    }
}
    // ACTIONS
     const actions: ActionTree<Profile, RootState> = {
     getProfileDetails({commit},username: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Staff/${username}`;
        return http
            .get(apiUrl)
            .then((res) => {
                if(res.status === 204 || (!res.data.isAdmin && res.data.isDisabled)) {
                    router.push("/invalidaccount");
                }
                else
                {              
                    const payload = {
                        newState: res.data,
                        userId: username,
                    }

                    commit("setProfileData", payload);
                    commit("setAppInsightEventData", payload.newState);
                }
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                router.push('/erroraccount');
            });
    },

    
    getSchedulingPrefDetails({commit},username: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/Schedule/${username}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                commit("setSchedulingPref", res.data);
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                console.log(err);
            });
    },

    
    saveSchedulingPrefDetails({commit},payload:any){        
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/Schedule/${payload.username}`;

        return http
            .post(apiUrl, payload.schPrefData)
            .then((res: AxiosResponse) => {
                commit("setSchedulingPref", payload.schPrefData);               
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() }) 
                console.log(err);
            });
    },

    
    getSMSPrefDetails({commit},username: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/Sms/${username}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                commit("setSMSPref", res.data);
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                console.log(err);
            });
    },

    
    saveSMSPrefDetails({commit}, payload:any) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/sms/${payload.username}`;

        return http
            .post(apiUrl, payload.smsData)
            .then((res: AxiosResponse) => {
               commit("setSMSPref", payload.smsData);
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                console.log(err);
            });
    },

    
    activateMobileNumber({commit}, payload:any){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/Sms/Activate/${payload.username}?phoneNumber=${payload.phoneNumber}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                commit("setSMSPref_AfterActivateMobileNumber", res.data);
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                throw err;
            });
    },

    
    reactivateMobileNumber({commit}, payload:any){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/Sms/Reactivate/${payload.username}?phoneNumber=${payload.phoneNumber}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                commit("setSMSPref_AfterActivateMobileNumber", res.data);
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                throw err;
            });
    },

    validateActivationCode({commit}, payload:any) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/Sms/Validate/${payload.username}?activationCode=${payload.activationCode}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                commit("setSMSPref_AfterValidateActivationCode", res.data);
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                throw err;
            });
    },

    getNotificationPrefDetails({commit}, username: string) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/Notification/${username}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                commit("setNotificationPref", res.data);
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                console.log(err);
            });
    },

    saveNotificationPrefDetails({commit}, payload:any ) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/Notification/${payload.username}`;

        return http
            .post(apiUrl, payload.ntfData)
            .then((res: AxiosResponse) => {
                commit("setNotificationPref", payload.ntfData);
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                console.log(err);
            });
    },
    
    updateWelcomePopupstatus({commit}, payload:any) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/UpdateWelcomePopupStatus`;

        return http
            .post(apiUrl, payload)
            .then((res: AxiosResponse) => {
                commit("setWelcomePopupStatus");
            })
            .catch((err: AxiosError) => {
                //Vue.notify({ type: "error", text: err.toString() })
                console.log(err);
            });
    },

     checkStaffManager({commit}, impersonateUsername: string){
         const apiUrl = `${process.env.VUE_APP_APIURL}/Profiles/CheckStaffManager/${impersonateUsername}`;
 
         return http
             .get(apiUrl)
             .then((res: AxiosResponse) => {
                 commit("setStaffManager",res.data);                 
             })
             .catch((err: AxiosError) => {
                 //Vue.notify({ type: "error", text: err.toString() })
                 console.log(err);
             });
     }
}

export const profile: Module<Profile, RootState> = {
    namespaced,
    state,
    actions,
    mutations
}