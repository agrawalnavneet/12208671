import { findUserById } from "../dao/user.dao.js"
import { verifyToken } from "../utils/helper.js"
import log from '../../../logging-middleware/logger.node.js';

export const authMiddleware = async (req, res, next) => {
    const token = req.cookies.accessToken
    if(!token) {
        log('backend', 'error', 'middleware', 'No access token provided');
        return res.status(401).json({message:"Unauthorized"})
    }
    try {
        const decoded = verifyToken(token)
        const user = await findUserById(decoded)
        if(!user) {
            log('backend', 'error', 'middleware', 'User not found for token');
            return res.status(401).json({message:"Unauthorized"})
        }
        req.user = user
        next()
    } catch (error) {
        log('backend', 'error', 'middleware', `Auth middleware error: ${error.message}`);
        return res.status(401).json({message:"Unauthorized",error})
    }
}