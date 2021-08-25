const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);

class AmaSession {
    constructor(ownerId) {
        this.ownerId = ownerId;
    }
}

module.exports = class Ama {
    sessions = {}; // each session is identified by the session Id

    createSession() {
        const sessionId = nanoid(); //assume no collision
        const ownerId = nanoid();
        this.sessions[sessionId] = new AmaSession(ownerId);
        return { session_id: sessionId, owner_id: ownerId };
    }
};
