export default class CommentModel {
    constructor (cmt) {
        this.cmt = cmt;
    }

    onAdd(payload) {
        const id = `${payload.id}`;
        const created_time = `${payload.created_time}`;
        const mess = `${payload.message}`;
        const from_name = `${payload.from.name}`;
        const from_id = `${payload.from.id}`;
        const from_avatar = 'https://graph.facebook.com/' + from_id + '/picture?width=70&height=70';
        const me = this.checkMe(from_id);
    
        let comment = {
            _id: id,
            created_time: created_time,
            message: mess,
            from_name: from_name,
            from_id: from_id,
            from_avatar: from_avatar,
            me:me
        }

        this.cmt.add(id, comment);
    }

    checkMe(from_id) {
        var me;
        from_id === '598135600563114' ? me = true : me = false;
        return me;
    }
}