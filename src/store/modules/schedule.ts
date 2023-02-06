import http from "@/store/axios";
import { Module, ActionTree, MutationTree } from 'vuex'
import { RootState } from "../types";
import { AxiosError, AxiosResponse } from "axios";
import { Event, UnavailabilityModel, DepartmentStaff, ScheduleActualCIOD } from '@/models';
import router from '@/router';
// import store from '@/store'
const namespaced = true

interface Schedule {

    // STATE
    userSchedules: object[],
    acknowledge: Boolean,
    assignmentDetail: any,
    requestDetail: any,
    selfScheduleShiftMembers: any,
    openNeedShiftMembers: any,
    pendingShiftDetails: any,
    selfScheduleShiftDetails: any,
    isLoading: Boolean ,
    potentialTradeAssignment: any,
    selfScheduleFacilities: any,
    selfScheduleDepartments: any,
    openNeedsFacilities: any,
    openNeedsDepartments: any,
    openNeedsShiftDetails: any,
    departmentSchedules: object[],
    payrollDetails: object[],
    defaultSelfSchedules: any,
    orAssignmentDetail: any
}
//state
const state: Schedule = {
    userSchedules: [],
    acknowledge: false,
    assignmentDetail: null,
    requestDetail: null,
    selfScheduleShiftMembers: null,
    openNeedShiftMembers: null,
    pendingShiftDetails: null,
    selfScheduleShiftDetails: null,
    isLoading: true,
    potentialTradeAssignment: null,
    selfScheduleFacilities: null,
    selfScheduleDepartments: null,
    openNeedsFacilities: null,
    openNeedsDepartments: null,
    openNeedsShiftDetails: null,
    departmentSchedules:[],
    payrollDetails: [],
    defaultSelfSchedules: null,
    orAssignmentDetail: null
}
   // mutations
const mutations: MutationTree<Schedule> = {
    setRequestDetail(state,newObj: any){
        state.requestDetail = newObj;
    },

   
    setStaffSchedule(state,schedules: any) {
        state.userSchedules = schedules;
        state.isLoading = false;
    },
   
     setAcknowledge(state,acknowledge: boolean) {
        state.acknowledge = acknowledge;
    },

   
     setAssignmentDetail(state,detail: any) {
        detail.shiftMembers.length > 0 ? detail.shiftMembers.map((member:any) => {
            member.name = member.firstName + ' ' + member.lastName;
            return member;
        }) : '';
        detail.shift = detail.shiftCode + ' ' + detail.shiftDescription;
        state.assignmentDetail = detail;
    },

    
     setOpenNeedShiftMembersDetails(state,detail: any){
        detail.shiftMembers.length > 0 ? detail.shiftMembers.map((member: any) => {
            member.name = member.firstName + ' ' + member.lastName;
            return member;
        }) : '';
        state.selfScheduleShiftMembers = detail;
    },

    
     setSelfScheduleShiftDetails(state,newObj: any): void {
        newObj.map((element: any) => {
            Object.defineProperty(element, 'shiftDescription', { value: element.shiftCode + ' ' + element.shiftDescription })
            Object.defineProperty(element, 'shiftValue', { value: +element.departmentShiftId + '_' + element.departmentId })
        });

        const lastUsedShiftCode = localStorage.getItem("lastUsedShiftCode");
        if (lastUsedShiftCode != null) {
            const itemIndex = newObj.findIndex((item:any) => item.shiftCode == lastUsedShiftCode);

            newObj.splice(
                0,                           // new index,
                0,                           // no removal
                newObj.splice(itemIndex, 1)[0] // detach the item and return it
            );
        }

        state.selfScheduleShiftDetails = newObj;
    },

   
     setSelfScheduleFacilities(state,newObj: any) {
        const removeDuplicatesFromArrayByProperty = (arr:any, prop:any) => arr.reduce((accumulator:any, currentValue:any) => {
            if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }, [])
        const facilities = removeDuplicatesFromArrayByProperty(newObj, 'facilityId');
        state.selfScheduleFacilities = facilities;
    },

    
    setSelfScheduleDepartments(state,newObj: any): void {
        const removeDuplicatesFromArrayByProperty = (arr:any, prop:any) => arr.reduce((accumulator:any, currentValue:any) => {
            if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }, [])

        const departments = removeDuplicatesFromArrayByProperty(newObj, 'departmentId');
        state.selfScheduleDepartments = departments;
    },

   
     setPendingShiftDetails(state,newObj: any) {
        state.pendingShiftDetails = newObj;
    },

    
     setOpenNeedsFacilities(state,newObj: any) {
        const removeDuplicatesFromArrayByProperty = (arr:any, prop:any) => arr.reduce((accumulator:any, currentValue:any) => {
            if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }, [])
        const facilities = removeDuplicatesFromArrayByProperty(newObj, 'facilityId');
        state.openNeedsFacilities = facilities;
    },

    
     setOpenNeedsDepartments(state,newObj: any): void {
        const removeDuplicatesFromArrayByProperty = (arr:any, prop:any) => arr.reduce((accumulator:any, currentValue:any) => {
            if (!accumulator.find((obj:any) => obj[prop] === currentValue[prop])) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }, [])

        const departments = removeDuplicatesFromArrayByProperty(newObj, 'departmentId');
        state.openNeedsDepartments = departments;
    },

   
     setOpenNeedsShiftDetails(state,newObj: any): void {
        newObj.map((element: any) => {
            Object.defineProperty(element, 'shiftDescription', { value: element.shiftCode + ' ' + element.shiftDescription })
            Object.defineProperty(element, 'shiftValue', { value: +element.departmentShiftId + '_' + element.departmentId })
        });
        state.openNeedsShiftDetails = newObj;
    },

    
     setDepartmentSchedules(state,schedules: DepartmentStaff[]) {
        state.departmentSchedules = schedules;
    },

    
     setPayrollDetails(state,lstPayrollDetails: ScheduleActualCIOD[]): void {
        state.payrollDetails = lstPayrollDetails;
    },

    
     setDefaultSelfSchedules(state,schedule: any): void {
        state.defaultSelfSchedules = schedule;
    },
    
     setORAssignmentDetail(state,detail: any): void {       
        state.orAssignmentDetail = detail;
    }
}
    // ACTIONS
    //actions
const actions: ActionTree<Schedule, RootState> = {
    getStaffSchedule({ commit, rootState },payload: any){
        const api = `${process.env.VUE_APP_CTI_APIURL}/Staff/${payload.staffId}/Schedule/${payload.scheduleId}`
        return http
            .get(api)
            .then((res: any) => {
                commit('setStaffSchedule', res.data)
                return res
            })
            .catch((err: AxiosError) => {
                router.push('/erroraccount');
            })

    },
   
     getAssignmentDetail({ commit, rootState }, payload: any) {
        const api = `${process.env.VUE_APP_APIURL}/Schedules/Assignments/${payload.id}/${payload.username}`

        return http
            .get(api)
            .then((res: any) => {
                commit('setAssignmentDetail', res.data);
                return res
            })
            .catch((err: AxiosError) => {
                console.log(err)
            })
    },
    
     GetRequestDetails({ commit, rootState }, payload: any) {
        const api = `${process.env.VUE_APP_APIURL}/Schedules/Requests/${payload.id}/${payload.username}`;

        return http
            .get(api)
            .then((res: any) => {
                commit('setRequestDetail', res.data);
                return res.data;
            })
            .catch((err: AxiosError) => {
                console.log(err)
            });
    },

    GetSelfScheduleNeedsDetails({ commit, rootState },payload: any) {
        const api = `${process.env.VUE_APP_APIURL}/Schedules/SelfScheduleNeeds/${payload.date}/${payload.username}?departmentIds=${payload.departmentIds}`;

        return http
            .get(api)
            .then((res: any) => {
                commit('setSelfScheduleShiftDetails', res.data);
                commit('setSelfScheduleFacilities', res.data);
                commit('setSelfScheduleDepartments', res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err)
            });
    },

   
    GetPendingShiftDetails({ commit, rootState },payload) {
        const api = `${process.env.VUE_APP_APIURL}/Schedules/PendingShifts/${payload.id}/${payload.username}`;

        return http
            .get(api)
            .then((res: any) => {
                console.log(res.data);
                commit('setPendingShiftDetails', res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err)
            });
    },

    GetNeedsDetails({ commit, rootState }, payload: any) {
        const api = `${process.env.VUE_APP_APIURL}/Schedules/Needs/${payload.date}/${payload.id}`;

        return http
            .get(api)
            .then((res: any) => {
                commit('setNeedsDetail', res.data);
            })
            .catch((err: AxiosError) => {
                console.log(err)
            });
    },

    
     WithdrawEvent(payload:any) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/OpenNeedRequest/${payload.needid}?assignmentId=${payload.assignementid}`;

        return http
            .delete(apiUrl)
            .then((res: AxiosResponse) => {
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     WithdrawRequestEvent({ commit, rootState },requestId: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/Requests/${requestId}`;

        return http
            .delete(apiUrl)
            .then((res: AxiosResponse) => {
            })
            .catch((err: AxiosError) => {
                throw err;
            });
    },

    
     getShiftTradeRequested({ commit, rootState }, payload: any){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/ShiftTradeRequested/${payload.shiftTradeOfferId}/${payload.username}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                return res.data;
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     ScheduleOpenNeedRequest({ commit, rootState },payload){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/OpenNeedRequest`;

        return http
            .post(apiUrl, payload)
            .then((res: AxiosResponse) => {
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     getOpenNeeds({ commit, rootState },data: any){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/OpenNeeds/${data.selectedDate}/${data.username}/${data.includePartials}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
               // this.openNeedShiftMembers = res;
               commit('setOpenNeedsShiftDetails', res.data);
               commit('setOpenNeedsFacilities', res.data);
               commit('setOpenNeedsDepartments', res.data);
                return res;
            })
            .catch((err: AxiosError) => {
                console.log(err)
            });
    },

    
     SavePendingShiftDetails({ commit, rootState },psData: any[]){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/PendingShifts`;

        return http
            .post(apiUrl, psData)
            .then((res: AxiosResponse) => {
                /*console.log(res);*/
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     RequestSchedule({ commit, rootState },psData){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/Requests`;

        return http
            .post(apiUrl, psData)
            .then((res: AxiosResponse) => {
                /*console.log(res);*/
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     DeletePendingShiftDetails({ commit, rootState },payload){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/PendingShifts/${payload.id}/${payload.username}`;

        return http
            .delete(apiUrl)
            .then((res: AxiosResponse) => {
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     SaveUnavailabilityDetails({ commit, rootState },uaData: UnavailabilityModel[]) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/Unavailabilities`;

        return http
            .post(apiUrl, uaData)
            .then((res: AxiosResponse) => {
                /*console.log(res);*/
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     DeleteUnavailabilityDetails({ commit, rootState },id: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/Unavailabilities/${id}`;

        return http
            .delete(apiUrl)
            .then((res: AxiosResponse) => {
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     getShiftTradeOffer({ commit, rootState },payload: any) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/ShiftTradeOffers/${payload.shiftTradeOfferId}/${payload.username}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                return res;
            })
            .catch((err: AxiosError) => {
                console.log(err)
            });
    },

    
     createShiftTradeOffers({ commit, rootState },payload: any) {
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/ShiftTradeOffers`;

        return http
            .post(apiUrl, payload)
            .then((res) => {
                return res;
            })
            .catch((err: AxiosError) => {
                throw err;
            });
    },

    
     deleteShiftTradeOffer({ commit, rootState },payload: any){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/ShiftTradeOffers/${payload.shiftTradeOfferId}/${payload.username}`;

        return http
            .delete(apiUrl)
            .then()
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     acceptShiftTradeOffer({ commit, rootState },payload: object){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/ShiftTradeOffers`;

        return http
            .post(apiUrl, payload)
            .then()
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     getPotetialTradeAssignment({ commit, rootState },payload: any){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/ShiftTradeOffers/PotentialTrades/${payload.assignmentId}?currentPage=${payload.currentPage}&pageSize=6&autoApprovableOnly=${payload.autoApprovableOnly}&searchFirstNameLike=${payload.searchFirstNameLike}&searchLastNameLike=${payload.searchLastNameLike}&searchStartDate=${payload.searchStartDate}&searchEndDate=${payload.searchEndDate}&primaryDeptOnly=${payload.primaryDeptOnly}`;

        return http
            .get(apiUrl)
            .then((res: AxiosResponse) => {
                return res.data;
            })
            .catch((err: AxiosError) => {
                console.log(err)
            });
    },

    
     withdrawPotentialTrade({ commit, rootState },shiftTradeOfferId: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/ShiftTradeOffers/${shiftTradeOfferId}`;

        return http
            .delete(apiUrl)
            .then((res: AxiosResponse) => {
                return res;
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

   
     SubmitCommitmentDetails({ commit, rootState },scheduleId: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/PendingShifts/${scheduleId}`;

        return http
            .post(apiUrl)
            .then((res: AxiosResponse) => {
                /*console.log(res);*/
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

   
     SaveSelfScheduleAsAssignment({ commit, rootState },assignmentData: any[]){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/Assigment`;

        return http
            .post(apiUrl, assignmentData)
            .then((res: AxiosResponse) => {
                /*console.log(res);*/
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

   
     DeleteSelfScheduleAssignment({ commit, rootState },assignmentId: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/Assigment/${assignmentId}`;

        return http
            .delete(apiUrl)
            .then((res: AxiosResponse) => {
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },

    
     GetScheduleAssignmentDetail({ commit, rootState },id: string){
        const api = `${process.env.VUE_APP_APIURL}/Schedules/Assignments/${id}`

        return http
            .get(api)
            .then((res: any) => {
                commit('setAssignmentDetail', res.data);
                return res
            })
            .catch((err: AxiosError) => {
                console.log(err)
            })
    },

    
     getDepartmentSchedule({ commit, rootState },payload: any){
        const api = `${process.env.VUE_APP_APIURL}/Schedules/DepartmentSchedules/${payload.deptId}/${payload.startDate}/${payload.endDate}/${payload.username}`;

        return http
            .get(api)
            .then((res: any) => {
                commit('setDepartmentSchedules', res.data)
                return res
            })
            .catch((err: AxiosError) => {
                console.log(err)
            })

    },

    // ACTIONS
    
     getPayrollDetails({ commit, rootState },payload: any) {
        const api = `${process.env.VUE_APP_APIURL}/Schedules/PayrollDetails/${payload.startDate}/${payload.endDate}/${payload.username}`;

        return http
            .get(api)
            .then((res: any) => {
                commit("setPayrollDetails", res.data);
                return res;
            })
            .catch((err: AxiosError) => {
                console.log(err);
            });
    },

    // ACTIONS
   
     getDefaultSelfSchedules({ commit, rootState },payload){
        const api = `${process.env.VUE_APP_APIURL}/Schedules/DefaultSchedules/${payload.username}`;

        return http
            .get(api)
            .then((res: any) => {
                commit('setDefaultSelfSchedules', res.data)
                return res
            })
            .catch((err: AxiosError) => {
                router.push('/erroraccount');
            })

    },

    
     UpdateDefaultSelfScheduleAppliedStatus({ commit, rootState },scheduleId: string){
        const apiUrl = `${process.env.VUE_APP_APIURL}/Schedules/DefaultSchedules/DefaultSelfScheduleApplied/${scheduleId}`;

        return http
            .post(apiUrl)
            .then((res: AxiosResponse) => {
            })
            .catch((err: AxiosError) => {
                console.log(err)
                throw err;
            });
    },
   
     getORAssignmentDetails({ commit, rootState },payload: any){
        const api = `${process.env.VUE_APP_APIURL}/Symphony/Procedures/${payload.date}/${payload.username}`

        return http
            .get(api)
            .then((res: any) => {
                commit('setORAssignmentDetail', res.data);
                return res
            })
            .catch((err: AxiosError) => {               
                 console.log(err)                
            })
    }

}
export const schedule: Module<Schedule, RootState> = {
    namespaced,
    state,
    actions,
    mutations
}