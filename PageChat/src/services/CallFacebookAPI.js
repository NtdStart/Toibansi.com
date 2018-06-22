import axios from 'axios'
import {apiUrlFb} from '../config/config'

// const pageId50k = '442408382863034';
const pageId50k = '598135600563114';
const limit = '15';

const access_token = 'EAACEdEose0cBAKNzD1dKlWgr21n789KJbC0XSnsuxeLil1FwZBut5GnuVJWU51MlDpBytyZBojtrtmkTZApaPsCXooFtZAHLcuSai3fz4iV56SjegVrceoZBZC6azopaFADQXlfmMagZAdvTgiEiCWuZAVeoM3fLYulnOtv864e4CaqDOZAgzgtvuavYanl3sVMqoJAWQF5jE7AZDZD';


export default class CallFacebookAPI {

    getConversations(cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = '?fields=can_reply,id,snippet,senders,updated_time&date_format=U';
        let endpoint = 'conversations' + fields + '&limit=' + limit + '&after=' + cursor + '&access_token=' + access_token;
        let url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
        return axios.get(url, options);
    }

    get_conversation_comment(cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = '?fields=can_reply,id,snippet,senders,updated_time&date_format=U';
        let endpoint = 'conversations' + fields + '&limit=' + limit + '&after=' + cursor + '&access_token=' + access_token;
        let url = `${apiUrlFb}/${pageId50k}/${endpoint}`;
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
        let endpoint = 'messages?fields=created_time,message,from,to,attachments{image_data,mime_type,name,size,video_data,file_url,id},sticker,id,tags,shares&limit=15'
            + '&date_format=U&access_token='
            + access_token;
        if (cursor != null)
            endpoint += '&after=' + cursor;
        let url = `${apiUrlFb}/${conversationId}/${endpoint}`;
        return axios.get(url, options);
    }

    getReplyComment(comment_id, cursor, options = null) {
        if (cursor === null) cursor = '';
        let fields = 'created_time,message,from,id,comment_count,attachment';
        let endpoint = `fields=${fields},comments{${fields}}&date_format=U&access_token=${access_token}`;
        let url = `${apiUrlFb}/${comment_id}?${endpoint}`;
        return axios.get(url, options);
    }

    getPageId() {
        return pageId50k;
    }

    post(endpoint = "", data = {}, options = {headers: {'Content-Type': 'application/json'}}) {
        let url = `${apiUrlFb}/${endpoint}`;
        return axios.post(url, data, options);
    }

}