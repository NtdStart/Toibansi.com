import axios from 'axios'
import {apiUrlFb} from '../config/config'

// const pageId50k = '442408382863034';
// const pageId50k = '158757974724465';
const pageId50k = '598135600563114';
const limit = '15';
const fields = '?fields=can_reply,id,snippet,senders';

const access_token = 'EAACEdEose0cBADwAVNo9rHrSZCYqZBcq2C5fvZAEJpZCZAwKoJBrY6OGtztLabaJht2BDGydr9TtylxtACKD0KCLLitf8imNwL45gXXEGb70vkZBFqcEL79K7s8BSOlzK1DgQ7fkoxkRk0IBZCJO5OAeQn2LWHMLuaTJtXo9gZAEseuJV5vyAbl1irbxtnehPX8VdZBWTEgBdAgZDZD';


export default class CallFacebookAPI {

    getConversations(endpoint, cursor, options = null) {
        endpoint = 'conversations' + fields + '&limit=' + limit + '&after=' + cursor + '&access_token=' + access_token;
        const url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    get_conversation_comment(cursor, options = null) {
        let endpoint = 'conversations' + fields + '&limit=' + limit + '&after=' + cursor + '&access_token=' + access_token;
        const url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    getComments(cursor, options = null) {
        let fields = 'comments{id,message,from,comment_count,comments,can_comment}';
        let endpoint = 'posts?fields=' + fields + '&after=' + cursor + '&access_token=' + access_token;
        let url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    getMessage(conversationId, cursor, options = null) {
        const endpoint = 'messages?fields=created_time,message,from,to,attachments{image_data,mime_type,name,size,video_data,file_url,id},sticker,id,tags,shares&limit=15' + '&after=' + cursor + '&access_token=' +access_token;
        const url = `${apiUrlFb}/${conversationId}/${endpoint}`;
        return axios.get(url, options);
    }

    getReplyComment(comment_id, cursor, options = null) {
        let fields = 'created_time,message,from,id,comment_count';
        const endpoint = `fields=${fields},comments{${fields}}&access_token=${access_token}`;
        const url = `${apiUrlFb}/${comment_id}?${endpoint}`;
        return axios.get(url, options);
    }

    getPosts(options = null) {
        let endpoint = 'posts';
        let url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    post(endpoint = "", data = {}, options = {headers: {'Content-Type': 'application/json'}}) {
        const url = `${apiUrlFb}/${endpoint}`;
        return axios.post(url, data, options);
    }

}