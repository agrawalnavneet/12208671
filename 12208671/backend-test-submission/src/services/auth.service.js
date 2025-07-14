import { createUser, findUserByEmail, findUserByEmailByPassword } from "../dao/user.dao.js"
import { ConflictError } from "../utils/errorHandler.js"
import {signToken} from "../utils/helper.js"
import log from '../../../logging-middleware/logger.node.js';

export const registerUser = async (name, email, password) => {
    const user = await findUserByEmail(email)
    if(user) {
        log('backend', 'error', 'service', 'User already exists');
        throw new ConflictError("User already exists")
    }
    const newUser = await createUser(name, email, password)
    const token = await signToken({id: newUser._id})
    return {token,user}
}

export const loginUser = async (email, password) => {
    const user = await findUserByEmailByPassword(email)
    if(!user) {
        log('backend', 'error', 'service', 'Invalid email or password');
        throw new Error("Invalid email or password")
    }

    const isPasswordValid = await user.comparePassword(password)
    if(!isPasswordValid) {
        log('backend', 'error', 'service', 'Invalid email or password');
        throw new Error("Invalid email or password")
    }
    const token = signToken({id: user._id})
    return {token,user}
}

