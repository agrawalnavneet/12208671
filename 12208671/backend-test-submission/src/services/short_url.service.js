import { generateNanoId } from "../utils/helper.js"
import urlSchema from "../models/short_url.model.js"
import { getCustomShortUrl, saveShortUrl } from "../dao/short_url.js"
import log from '../../../logging-middleware/logger.node.js';

export const createShortUrlWithoutUser = async (url) => {
    const shortUrl = generateNanoId(7)
    if(!shortUrl) throw new Error("Short URL not generated")
    await saveShortUrl(shortUrl,url)
    return shortUrl
}

export const createShortUrlWithUser = async (url,userId,slug=null) => {
    const shortUrl = slug || generateNanoId(7)
    const exists = await getCustomShortUrl(slug)
    if(exists) {
        log('backend', 'error', 'service', 'Custom URL already exists');
        throw new Error("This custom url already exists")
    }
    await saveShortUrl(shortUrl,url,userId)
    log('backend', 'info', 'service', 'Short URL created successfully');
    return shortUrl
}