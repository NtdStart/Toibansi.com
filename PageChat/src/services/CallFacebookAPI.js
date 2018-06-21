import axios from 'axios'
import {apiUrlFb} from '../config/config'

const pageId50k = '442408382863034';
const limit = '15';
const fields = '?fields=can_reply,id,snippet,senders';

const access_token = 'EAACEdEose0cBAIXmWhGUZBuZCg47JlH8kO2H4uYdn8fFFKSAZAfE3l4LrRSbGaJWZAqgknHkZBRZCjaMe4rHG5waQ7Mo3mXQywHPXgKkTca1GkcFxsTj2bMNFUALen0QniUZBzwBequAS6wQopZB3m6sQocufgjI1Pl01d9loBZCPo9ZA9CWDNjExaFkelOUC8TZBQS6apH6AbS9gZDZD';


export default class CallFacebookAPI {

    getConversations(endpoint, cursor, options = null) {
        if (cursor === null) cursor = '';
        endpoint = 'conversations' + fields + '&limit=' + limit + '&after=' + cursor + '&access_token=' + access_token;
        const url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    get_conversation_comment(cursor, options = null) {
        if (cursor === null) cursor = '';
        let endpoint = 'conversations' + fields + '&limit=' + limit + '&after=' + cursor + '&access_token=' + access_token;
        const url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    getComments(cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = 'comments{id,message,from,comment_count,comments,can_comment}';
        let endpoint = 'posts?fields=' + fields + '&after=' + cursor + '&access_token=' + access_token;
        let url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    getMessage(conversationId, cursor, options = null) {
        if (cursor === null) cursor = '';
        const endpoint = 'messages?fields=created_time,message,from,to,attachments{image_data,mime_type,name,size,video_data,file_url,id},sticker,id,tags,shares&limit=15' + '&after=' + cursor + '&access_token=' +access_token;
        const url = `${apiUrlFb}/${conversationId}/${endpoint}`;
        return axios.get(url, options);
    }

    getReplyComment(comment_id, cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = 'created_time,message,from,id,comment_count';
        const endpoint = `fields=${fields},comments{${fields}}&access_token=${access_token}`;
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

}