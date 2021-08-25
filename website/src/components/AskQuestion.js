import React from 'react';
import { host } from '../commons';

export default class AskQuestion extends React.Component {
    state = {
        question: '',
        isLoading: false,
    };
    submitQuestion = () => {
        this.setState({ isLoading: true });
        fetch(`${host}/sessions/${this.props.sessionId}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: this.state.question,
            }),
        })
            .then((res) => res.json())
            .then((json) => {
                if (json.error) return alert(json.error);
                alert('Success!');
            })
            .finally(() => this.setState({ isLoading: false }));
    };
    render() {
        return (
            <div>
                <p>
                    <label>Question:</label>
                    <textarea
                        rows={5}
                        value={this.state.question}
                        onChange={(event) => this.setState({ question: event.target.value })}
                    ></textarea>
                    <button onClick={this.submitQuestion} disabled={this.state.isLoading}>
                        {' '}
                        Submit{' '}
                    </button>
                </p>
            </div>
        );
    }
}
