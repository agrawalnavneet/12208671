import urlSchema from "../models/short_url.model.js";
import { ConflictError } from "../utils/errorHandler.js";
import log from '../../../logging-middleware/logger.node.js';

export const saveShortUrl = async (shortUrl, longUrl, userId) => {
    try{
        const newUrl = new urlSchema({
            full_url:longUrl,
            short_url:shortUrl
        })
        if(userId){
            newUrl.user = userId
        }
        await newUrl.save()
    }catch(err){
        if(err.code == 11000){
            log('backend', 'error', 'db', 'Short URL already exists');
            throw new ConflictError("Short URL already exists")
        }
        log('backend', 'fatal', 'db', `DB error: ${err.message}`);
        throw new Error(err)
    }
};

export const getShortUrl = async (shortUrl) => {
    return await urlSchema.findOneAndUpdate({short_url:shortUrl},{$inc:{clicks:1}});
}

export const getCustomShortUrl = async (slug) => {
    return await urlSchema.findOne({short_url:slug});
}