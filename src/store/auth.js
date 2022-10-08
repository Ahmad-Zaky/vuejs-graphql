import axios from "axios";
import {AUTH_TOKEN, apolloClient, onLogin, onLogout} from "@/vue-apollo";
import PROFILE_USER from "@/graphql/Auth/Profile.gql";

function initState() {
    return {
        token: null,
        user: {},
    };
}

// Prepare Data
const loginPath = "login";
const logoutPath = "logout";
const LOGIN_URL = process.env.VUE_APP_SERVER_HTTP + loginPath;
const LOGOUT_URL = process.env.VUE_APP_SERVER_HTTP + logoutPath;

const getters = {
    isAuthenticated: (state) => !!state.token,
    user: (state) => state.user,
};


const actions = {
    async login({commit, dispatch}, auth) {
        return new Promise((resolve, reject) => {
            axios
                .post(LOGIN_URL, auth)
                .then(async (response) => {
                    let token = response.data.token;
                    
                    await onLogin(apolloClient, token);
                    commit("setToken", token);
                    
                    dispatch("setUser");
                    resolve(response);
                })
                .catch((error) => reject(error));
        });
    },

    async logout({commit, state}) {
        return new Promise((resolve) => {
            axios
                .post(
                    LOGOUT_URL,
                    {},
                    { headers: {Authorization: "Bearer " + state.token} }
                )
                .then(async () => {
                    await onLogout(apolloClient);

                    commit("setToken", null);
                    commit("loginUser", {});
                });
            resolve();
        });
    },

    async setUser({commit}) {
        const {data} = await apolloClient.query({query: PROFILE_USER});
        commit("loginUser", data.profile);
    },

    async attemptAuthentication({commit, dispatch}) {
        let token = localStorage.getItem(AUTH_TOKEN);

        commit("setToken", token);
        dispatch("setUser");
    },
};

const mutations = {
    setToken(state, token) {
        state.token = token;
    },
    loginUser(state, user) {
        state.user = {...user};
    },
};

export default {
    namespaced: true,
    state: initState,
    getters,
    actions,
    mutations,
};