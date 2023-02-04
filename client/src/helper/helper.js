import axios from 'axios';
import { StatusCodes } from 'http-status-codes';

/* Make API Requests */

/* authenticate function */
export async function authenticate(username){
    try {
        return await axios.post('/authenticate', {username});
    } catch (error) {
        return { error: "username doesn't exist...!" }
    }
}

/* get user details */
export async function getUser({ username }){
    try {
        const { data } = await axios.get(`/user/${username}`);
        return { data };
    } catch (error) {
        return { error: "username doesn't Match...!" }
    }
}

/* register user function */
export async function registerUser(credentials ){
    try {
        const { data : { message }, status } = await axios.post('/register', credentials);

        let { username, email } = credentials;

        /* send email */
        if(status === status(StatusCodes.CREATED)){
            await axios.post('/email', { username, email });
        }
    } catch (error) {
        return Promise.reject({error});
    }
}