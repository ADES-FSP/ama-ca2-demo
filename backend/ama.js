const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10);
const createError = require('http-errors');

class AmaSession {
    constructor(ownerId) {
        this.ownerId = ownerId;
        this.status = 0;
    }

    updateSession(action) {
        if (action === 'stop') {
            this.status = 0;
        } else if (action === 'start') {
            this.status = 1;
        } else {
            throw createError(400, `Unknown Action: ${action}`);
        }
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

    updateSession(sessionId, action) {
        const session = this.sessions[sessionId];
        if (!session) throw createError(404, `Unknown Session: ${sessionId}`);
        session.updateSession(action);
    }
};
