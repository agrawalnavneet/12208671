import { findUserById } from "../dao/user.dao.js"
import { verifyToken } from "./helper.js"
import log from '../../../logging-middleware/logger.node.js';


export const attachUser = async (req, res, next) => {
    const token = req.cookies.accessToken
    if(!token) return next()

    try {
        const decoded = verifyToken(token)
        const user = await findUserById(decoded)
        if(!user) return next()
        req.user = user
        next()
    } catch (error) {
        log('backend', 'error', 'middleware', `attachUser error: ${error.message}`);
        next()
    }
}