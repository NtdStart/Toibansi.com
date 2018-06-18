import axios from 'axios'
import {apiUrlFb} from '../config/config'

const pageId50k = '598135600563114';
const limit = '8';
const fields = '?fields=can_reply,id,snippet,senders';

const access_token = 'EAACEdEose0cBAISzh4lUDlMQIqLleS9kZASzklX4U9iP8du3ydh7hTDeE5qV4aZBrhZAYkzibLiFZAcDqDyuvqqREZChYPKqcB8ZBRYw8sKiGcGlen3rrMi5WrGP4qUnBXtbHDJF5AARGsGwtuZCZB2OAJ0RHcfwZBjcG0rLqdbAZCzUE0mDeU5U7ST1chXHxQIsbZBW3kuq5dGbgZDZD';


export default class CallFacebookAPI {

    getConversations(endpoint, options = null) {
        endpoint = 'conversations' + fields + '&limit=' + limit + '&access_token=' + access_token;
        const url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }


    getMessage(conversationId, options = null) {
        const endpoint = 'messages?fields=created_time,message,from,to,attachments{image_data,mime_type,name,size,video_data,file_url,id},sticker,id,tags,shares&limit=5&access_token=' + access_token;
        const url = `${apiUrlFb}/${conversationId}/${endpoint}`;
        return axios.get(url, options);
    }

    post(endpoint = "", data = {}, options = {headers: {'Content-Type': 'application/json'}}) {
        const url = `${apiUrlFb}/${endpoint}`;
        return axios.post(url, data, options);
    }

}