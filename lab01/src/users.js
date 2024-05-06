const cred = {
    admins: [
        {
            login: 'admin1',
            pass: '$2a$04$6jlHH0pP2FkM9m5W3G3KK.5qBoMv.73V2ITWeqlOjBVrFMBmbAHce', //secret
            role: 'admin'
        },
        {
            login: 'admin2',
            pass: '$2a$04$6jlHH0pP2FkM9m5W3G3KK.5qBoMv.73V2ITWeqlOjBVrFMBmbAHce', //secret
            role: 'admin'
        }
    ],
    users: [
        {
            login: 'user1',
            pass: '$2a$04$6jlHH0pP2FkM9m5W3G3KK.5qBoMv.73V2ITWeqlOjBVrFMBmbAHce', //secret
            role: 'user'
        },
        {
            login: 'user2',
            pass: '$2a$04$6jlHH0pP2FkM9m5W3G3KK.5qBoMv.73V2ITWeqlOjBVrFMBmbAHce', //secret
            role: 'user'
        }
    ],
};
module.exports = cred
