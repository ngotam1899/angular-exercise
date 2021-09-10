import { environment } from 'src/environments/environment';

export const urlConstant = {
  API: {
    AUTH: {
      SIGNIN: environment.serverUrl + "/signin",
      GET_PROFILE: environment.serverUrl + "/userProfile",
    },
    USER: environment.serverUrl + "/user_management",
    CONTACT: environment.serverUrl + "/contacts",
    SALES_ORDER: environment.serverUrl + "/sales_order",
  },
}