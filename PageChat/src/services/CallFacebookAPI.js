import axios from 'axios'
import {apiUrlFb} from '../config/config'
const pageId50k = '158757974724465';
const limit = '15';

const access_token = 'EAACEdEose0cBAM0zFtHhHZBDPij5VuNdVvMPvLL8QtUVrW4KT8aN2OdBZBKPb32mGMgENtENDGGPsBLDexsa9aOsraqlSD6mWJzDVJQGArnqZBiX3gK5dePfDgLfaQhbv5GfnLlhm3rThTXQyAyqb7VHiXkiiVqAUxFo3OIxwfdLfWxkoWMt8icpDuySl4ZD';


export default class CallFacebookAPI {

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
        let fields = 'comments{id,message,from,comment_count,comments,can_comment,created_time,attachment}&date_format=U';
        let endpoint = 'posts?fields=' + fields + '&after=' + cursor + '&access_token=' + access_token;
        let url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    getMessage(conversationId, cursor, options = null) {
        if (cursor === null) cursor = '';
        const endpoint = 'messages?fields=created_time,message,from,to,attachments{image_data,mime_type,name,size,video_data,file_url,id},sticker,id,tags,shares&limit=15' + '&after=' + cursor + '&date_format=U&access_token=' +access_token;
        const url = `${apiUrlFb}/${conversationId}/${endpoint}`;
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
        if(typeof message === 'string') {
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

    postComment(postId, message, options = null) {
        const url = `${apiUrlFb}/${postId}/comments?access_token=${access_token}`;
        if(typeof message === 'string') {
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