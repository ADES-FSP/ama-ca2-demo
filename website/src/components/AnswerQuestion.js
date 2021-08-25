import React from 'react';
import { host } from '../commons';

export default class AnswerQuestion extends React.Component {
    state = {
        answer: '',
        question: '',
    };
    componentDidMount() {
        fetch(
            `${host}/sessions/${this.props.location.state.sessionId}/questions/${this.props.location.state.questionId}`,
        )
            .then((res) => res.json())
            .then((json) => {
                if (json.error) return alert(json.error);
                this.setState({
                    question: json.question,
                    answer: json.answer,
                });
            });
    }

    postAnswer = () => {};

    render() {
        return (
            <div>
                <p>{this.state.question}</p>
                <p>
                    <label>Answer:</label>
                    <textarea
                        value={this.state.answer}
                        onChange={(event) => this.setState({ answer: event.target.value })}
                    ></textarea>
                    <button>Submit</button>
                </p>
            </div>
        );
    }
}
