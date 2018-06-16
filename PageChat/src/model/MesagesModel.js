export default class MessagesModel {

    constructor(mess) {
        this.mess = mess;
    }


    onAdd(payload) {
        const id = `${payload.id}`;
        const created_time = `${payload.created_time}`;
        const mess = `${payload.message}`;
        const from_name = `${payload.from.name}`;
        const from_id = `${payload.from.id}`;
        const from_avatar = 'https://graph.facebook.com/' + from_id + '/picture?width=70&height=70';
        // const tags = `${payload.tags}`;
        const to_name = `${payload.to.data[0].name}`;
        const to_id = `${payload.to.data[0].id}`;
        const to_avatar = 'https://graph.facebook.com/' + to_id + '/picture?width=70&height=70';
        const me = this.checkMe(from_id);


        let message = {
            _id: id,
            created_time: created_time,
            message: mess,
            from_name: from_name,
            from_id: from_id,
            from_avatar: from_avatar,
            to_name: to_name,
            to_id: to_id,
            to_avatar: to_avatar,
            me: me,
        };

        this.mess.addMess(id, message);
    }

    checkMe(from_id) {
        var me;
        from_id === '598135600563114' ? me = true : me = false;
        return me;
    }

    send(msg = {}) {

        const isConnected = this.isConnected;

        if (this.ws && isConnected) {

            const msgString = JSON.stringify(msg);

            this.ws.send(msgString);
        }

    }

    authentication() {
        const conversation = this.converstation;

        const tokenId = conversation.getUserTokenId();

        if (tokenId) {

            const message = {
                action: 'auth',
                payload: `${tokenId}`
            }

            this.send(message);
        }

    }

}