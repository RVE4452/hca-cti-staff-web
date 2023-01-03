import http from "@/store/axios";
import { Module, ActionTree, MutationTree } from 'vuex'
import { RootState } from "../types";
import { NotificationList } from '@/models';
//   import { ORSchedule } from '@/models';
const namespaced = true

export interface Notification {
    notificationList : any   
}

   //state
const state: Notification = {
    notificationList : null 
}

   
    const mutations: MutationTree<Notification> = {
     setAllNotification(state,notifications: Array<NotificationList>) {
        state.notificationList = []; 
        state.notificationList = notifications;
        state.notificationList.sort((a:any, b:any) => {
            if(a.read && !b.read) return 1;
            if(!a.read && b.read) return -1;
            return 0;
        });
     }}

    //actions
    const actions: ActionTree<Notification, RootState> = {
     getAllNotifications({commit},userId: string) {
        const api = `${process.env.VUE_APP_BASE_API_URL}/Notifications/${userId}`;

        return http
            .get(api)
            .then((res) => {
                commit('setAllNotification', res.data)
                return res
            })
            .catch((err) => {
                console.log(err)
            })
    },

   
    statusUpdate(notification: any){
        const api = `${process.env.VUE_APP_BASE_API_URL}/Notifications`;
        return http
            .post(api, notification.data)
            .then((res: any) => {
                // this.context.commit('setAllNotification', notification.list)
                return res
            })
            .catch((err) => {
                console.log(err)
            })
    },

    
    deleteNotification({commit},notificationId: string){
        
        const api = `${process.env.VUE_APP_BASE_API_URL}/Notifications/${notificationId}`;

        return http
            .delete(api)
            .then((res) => {
               commit('setAllNotification', res.data)
                return res
            })
            .catch((err) => {
                console.log(err)
            })
    }

}

export const notification: Module<Notification, RootState> = {
    namespaced,
    state,
    actions,
    mutations
}