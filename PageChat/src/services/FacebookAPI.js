import axios from 'axios'
import {apiUrlFb} from '../config/config'

// const pageId50k = '158757974724465';
const pageId50k = '598135600563114';
const limit = '15';

const access_token = 'EAAc4hc2H1NcBAODfcHEHv0ggOR0sS7ZBdZBlBSvxNg5vvxpBOemPH5ZBbQrBuD6KAbFpGWXdB1btigQuOlpcZAkkZBz63460s3ahkonfNhsiez4kSJ2BoGCSOp270DywCjqVZCnEBxyoVvzTRomxLG1Rbp02JHimNMXVVmVJVlS7RPhEkvSWDkgzuhWMOxX2QZD';
// const access_token50k = 'EAAc4hc2H1NcBAECUI7kXwY4egX5XgGa5G3RN0EtXC1owPY6v4GOZCTZAZCEw6y1ID8JiCtvj5pa3zHMZB5K99ivUjJBEKEYJMPtY7sh8reOZC3ZAldPuyo7sMqcPgYL25yqNPz1vTx1iROe7MACHZCZC9IENZACMmXYV8KDbxApx4khhupjVy57kb';
// const access_tokenGT = 'EAAc4hc2H1NcBALvMYa8yaPOtnEK9IrLZAAWaxiVcZAq92xiXAAWzZCZBvxfWZCrZAD3qvZBieU6zs5oZAQZC3X8IyBDeAawPxMgz4p68B8YDNEDYSdVJZCg1yVZC8kCOLjTo8PL7BBZA5xXbQSB0xQj49iG2iNuxGEjgi7REkbyoq0q2yAZDZD';
// const access_tokenTBS = 'EAAc4hc2H1NcBALZADU2DOEok3egjTiLCtceVWjgSxQOFQz7RCKKd04D1mMZBIdC8yVqfKI4VhrO3A8hFqeVinUD0NtCPojbR6MBheR5RTC7EuJf90zXkUxZB9bAzVo0d2Corg6U7hBA5Udi4ugZAFzdvdOGrgxUZCD2hO1ZBMuPSZCYPkzMZCwbW';
// const access_tokenOLVN = 'EAAc4hc2H1NcBALfhLEJdlgLXZCOMNJPM4HvNIcOkZCgqv54ujtqrTga0wrP5IzEnEsHVasr8kW2W9rUrZCECh81FsMQbDekqNzikmSAVtnQPXCjZAMukH0OE1KrbIC36KlebVZAQmpWZCXyKOAQeQXawDeKJtvo27gGzIryiWgPgZDZD';


export default class FacebookAPI {

    getConversations(cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = '?fields=can_reply,id,snippet,senders,updated_time,unread_count&date_format=U';
        let endpoint = 'conversations' + fields + '&limit=' + limit + '&after=' + cursor + '&access_token=' + access_token;
        const url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    get_conversation_comment(cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = '?fields=can_reply,id,snippet,senders,updated_time,unread_count&date_format=U';
        let endpoint = 'conversations' + fields + '&limit=' + limit + '&after=' + cursor + '&access_token=' + access_token;
        const url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    getComments(cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = 'comments{id,message,from,comment_count,comments.order(reverse_chronological).limit(1){from,message,created_time},can_comment,created_time,attachment}&date_format=U';
        let endpoint = 'posts?fields=' + fields + '&after=' + cursor + '&access_token=' + access_token;
        let url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    getMessage(conversationId, cursor, options = null) {
        let endpoint = 'messages?fields=created_time,message,from,to,attachments{image_data,mime_type,name,size,video_data,file_url,id},sticker,id,tags,shares&limit=15'
            + '&date_format=U&access_token='
            + access_token;
        if (cursor != null)
            endpoint += '&after=' + cursor;
        let url = `${apiUrlFb}/${conversationId}/${endpoint}`;
        return axios.get(url, options);
    }

    getMessageById(id, options = null) {
        const enpoint = 'fields=created_time,from,id,message,sticker,tags,to,attachments{image_data,mime_type,name,size,video_data,id},shares&access_token=' + access_token;
        const url = `${apiUrlFb}/${id}?${enpoint}`;
        return axios.get(url, options);
    }

    getCommentById(id, options = null) {
        const enpoint = 'access_token=' + access_token;
        const url = `${apiUrlFb}/${id}?${enpoint}`;
        return axios.get(url, options);
    }

    getReplyComment(comment_id, cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = 'created_time,message,from,id,comment_count,attachment';
        const endpoint = `fields=${fields},comments{${fields}}&date_format=U&access_token=${access_token}`;
        const url = `${apiUrlFb}/${comment_id}?${endpoint}`;
        return axios.get(url, options);
    }

    getPageId() {
        return pageId50k;
    }

    post(endpoint = "", data = {}, options = {headers: {'Content-Type': 'application/json'}}) {
        const url = `${apiUrlFb}/${endpoint}`;
        return axios.post(url, data, options);
    }

    sendMessage(conversationId, message, options = null) {
        const url = `${apiUrlFb}/${conversationId}/messages?access_token=${access_token}`;
        if (typeof message === 'string') {
            const data = {
                message: message
            }
            return axios.post(url, data, options);
        } else {
            const formData = new FormData();
            formData.append('photo', message, message.file);
            return axios.post(url, formData, options);
        }
    }

    subscribeWebhook() {
        const url = `${apiUrlFb}/${pageId50k}/subscribed_apps`;
        return axios.post(url, {access_token: access_token});
    }

    postComment(postId, message, options = null) {
        const url = `${apiUrlFb}/${postId}/comments?access_token=${access_token}`;
        if (typeof message === 'string') {
            const data = {
                message: message
            }
            return axios.post(url, data, options);
        } else {
            const formData = new FormData();
            formData.append('photo', message, message.file);
            return axios.post(url, formData, options);
        }
    }
}
