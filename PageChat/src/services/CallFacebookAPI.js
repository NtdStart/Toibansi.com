import axios from 'axios'
import {apiUrlFb} from '../config/config'

const pageId50k = '598135600563114';
const limit = '20';
const fields = '?fields=can_reply,id,snippet,senders';

const access_token = 'EAACEdEose0cBAOog3vPVkC8ZAnZBgGAZAFDmYnjRSeZBOY99EEGvfQ9UZA1BaQbzCHs7U69ZAl8WabCPLqRcZCTXYRMTpTZCoCQOmeSQNE8et8TvpIwQ7CUIX35tFopYNu2pUsyofRAs7CyO6Bl4GVswzksKu1ErkhjH7JGoK19HDbAw8bViZBu3ryQsyjnnZCjkzPg1f3isnL5QZDZD';


export default class CallFacebookAPI {

    getConversations(endpoint, options = null) {
        endpoint = 'conversations' + fields + '&limit=' + limit + '&access_token=' + access_token;
        const url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }


    getMessage(conversationId, options = null) {
        const endpoint = 'messages?fields=created_time,message,from,to,attachments{image_data,mime_type,name,size,video_data,file_url,id},sticker,id,tags,shares&limit=10&access_token=' + access_token;
        const url = `${apiUrlFb}/${conversationId}/${endpoint}`;
        return axios.get(url, options);
    }

    post(endpoint = "", data = {}, options = {headers: {'Content-Type': 'application/json'}}) {
        const url = `${apiUrlFb}/${endpoint}`;
        return axios.post(url, data, options);
    }

}