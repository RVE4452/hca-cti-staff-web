import http from "@/store/axios";
import { Module, ActionTree, MutationTree } from 'vuex'
import { RootState } from "../types";

const namespaced = true

export interface User {
    name : string   
}

   //state
const state: User = {
    name : '' 
}
const mutations: MutationTree<User> = {
     setName(state,newName: string): void {
        state.name = newName
    }}
   //actions
   const actions: ActionTree<User, RootState> = {
    updateName({commit},newName: string): void {
        commit('setName', newName)
    }    
}

export const user: Module<User, RootState> = {
    namespaced,
    state,
    actions,
    mutations
}
