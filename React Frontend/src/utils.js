import axios from "axios"
import { jobload } from "./store"
import { useDispatch } from 'react-redux';

export const logineval = async (username, password) => {
    try {
        console.log("inside logineval")
        const user_credentials = { "username": username, "password": password }
        const user_details = { 'username': username, 'password': password, 'logout': 1 }

        window.localStorage.setItem('user-details', JSON.stringify(user_details));
        const rs = window.localStorage.getItem('user-details')
        console.log("printing rs", rs)
        const response = await axios.post('http://127.0.0.1:8000/api/login/', user_credentials)
        console.log(response)
        window.localStorage.setItem('user-state', JSON.stringify(response.data));
        console.log(response.data.message)
        return response.data.message;
    }
    catch (e) {
        console.log("Error response:", e.response.data);
        return e.response.data.message

    }
}



export const registeruser = async (username, email, password, confirmpassword) => {
    try {
        console.log("inside logineval")
        const user_credentials = { "username": username, "email": email, "password": password, "confirmpassword": confirmpassword }
        console.log("user credentials inside registeruser", user_credentials)
        const response = await axios.post('http://127.0.0.1:8000/api/register/', user_credentials)
        console.log(response)
        window.localStorage.setItem('user-state', JSON.stringify(response.data));
        console.log(response.data.message)
        return response.data.message;
    }
    catch (e) {
        console.log("Error response:", e.response.data);
        return e.response.data.message

    }
}

export const jobpost = async (jobname, priority, deadline, duration, dispatch) => {
    const states = JSON.parse(window.localStorage.getItem('user-state'))
    console.log("states", states)
    let response = ""
    let response2 = ""
    const job = { "job_name": jobname, "priority": priority, "estimated_duration": duration, "deadline": deadline, "user": states.user }
    try {
        response = await axios.post('http://127.0.0.1:8000/api/jobs/', job, {
            headers: {
                'Authorization': `Bearer ${states.access_token}`,
                'Content-Type': 'application/json',
            },
        })
    }
    catch (e) {
        console.log(e.message)
        if (e.message === 'Request failed with status code 401') {
            console.log(states.refresh_token)
            const result = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: states.refresh_token },
                { headers: { 'Content-Type': 'application/json' } }
            )
            console.log(result.data.access)
            const new_state = {
                ...states,
                access_token: result.data.access
            };
            window.localStorage.setItem('user-state', JSON.stringify(new_state));
            response2 = await axios.post('http://127.0.0.1:8000/api/jobs/', job, {
                headers: {
                    'Authorization': `Bearer ${new_state.access_token}`,
                    'Content-Type': 'application/json',
                },
            })
        }
    }
    return { response, response2 };
}


export const joblisting = async (dispatch) => {
    const states = JSON.parse(window.localStorage.getItem('user-state'))
    let response = []
    try {
        console.log("inside joblisting")
        response = await axios.get(`http://127.0.0.1:8000/api/joblist/${states.user}/`, {
            headers: {
                'Authorization': `Bearer ${states.access_token}`,
                'Content-Type': 'application/json',
            },
        });
        console.log("resposnse data", response.data)
        if (response.data) {
            dispatch(jobload(response.data))
        }

    }
    catch (e) {
        console.log(e.message)
        if (e.message === 'Request failed with status code 401') {
            console.log(states.refresh_token)
            const result = await axios.post('http://127.0.0.1:8000/api/token/refresh/', { refresh: states.refresh_token },
                { headers: { 'Content-Type': 'application/json' } }
            )
            console.log(result.data.access)
            const new_state = {
                ...states,
                access_token: result.data.access
            };
            window.localStorage.setItem('user-state', JSON.stringify(new_state));
            response = await axios.get(`http://127.0.0.1:8000/api/joblist/${states.user}/`, {
                headers: {
                    'Authorization': `Bearer ${new_state.access_token}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log(response.data)
            if (response.data) {
                dispatch(jobload(response.data))
            }
        }
        else {
            console.log(e)
        }
    }
    return response.data
}
