// Optional OIDC event listeners
import http from "@/store/axios";

export const oidcEventListeners = {
  userLoaded: (user: any) => {
    http.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${user.access_token}`
  }
}
