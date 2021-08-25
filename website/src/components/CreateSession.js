import React from 'react';
import { host } from '../commons';

export default class CreateSession extends React.Component {
    state = {
        sessionId: '',
        ownerId: '',
    };
    createSession = () => {
        fetch(`${host}/sessions`, { method: 'POST' })
            .then((res) => res.json())
            .then((json) => {
                if (json.error) return alert(json.error);
                this.setState({
                    sessionId: json.session_id,
                    ownerId: json.owner_id,
                });
                this.props.onCreate(json.session_id);
            });
    };

    render() {
        return (
            <div>
                <button onClick={this.createSession}>Create Session! ✨</button>
                <p>
                    Session id: <span>{this.state.sessionId}</span>
                </p>
                <p>
                    Owner id: <span>{this.state.ownerId}</span>
                </p>
            </div>
        );
    }
}
