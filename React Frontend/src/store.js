import { createStore } from 'redux';

const initialState = {
    username: '',
    password: '',
    email: '',
    password: '',
    jobs: [],
    dashboard: {
        jobStatus: 'All',
        jobs: [],
        total_pages: 0
    },
    logout: 0
};

const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';
const REGISTER = 'REGISTER';
const JOB_LOAD = 'JOB_LOAD';
const DASHBOARD = 'DASHBOARD';

export const login = (username, password) => ({
    type: LOGIN,
    payload: { username, password },
});

export const logout = () => ({
    type: LOGOUT,
});

export const jobload = (jobs) => ({
    type: JOB_LOAD,
    payload: { jobs },
});


export const register = (username, email, password, confirmpassword) => ({
    type: LOGIN,
    payload: { username, email, password, confirmpassword },
});

export const dashboard = (jobStatus, total_pages, jobs) => ({
    type: DASHBOARD,
    payload: {
        dashboard: {
            jobs,
            jobStatus,
            total_pages
        }
    },
});

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state,
                username: action.payload.username,
                password: action.payload.password,
                logout: 1
            };
        case LOGOUT:
            return {
                ...initialState,
                logout: 1
            };

        case JOB_LOAD:
            return { ...state, jobs: action.payload.jobs };

        case DASHBOARD:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    jobs: action.payload.dashboard.jobs,
                    jobStatus: action.payload.dashboard.jobStatus,
                    total_pages: action.payload.dashboard.total_pages,
                },
            };

        case REGISTER:
            return {
                ...state,
                username: action.payload.username,
                password: action.payload.password,
                email: action.payload.email,
                confirmpassword: action.payload.confirmpassword
            };
        default:
            return state;
    }
};

const store = createStore(userReducer);

export default store;
