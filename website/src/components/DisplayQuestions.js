import React from 'react';
import { Link } from 'react-router-dom';
import { host } from '../commons';

export default class DisplayQuestions extends React.Component {
    state = {
        questions: [],
        answers: [],
        questionIds: [],
    };

    refreshData = () => {
        fetch(`${host}/sessions/${this.props.sessionId}`)
            .then((res) => res.json())
            .then((json) => {
                if (json.error) return alert(json.error);
                this.setState({
                    questions: json.questions,
                    answers: json.answers,
                    questionIds: json.question_ids,
                });
            });
    };

    componentDidUpdate(prevProp) {
        if (prevProp.sessionId !== this.props.sessionId) {
            this.refreshData();
        }
    }

    render() {
        return (
            <div>
                <button onClick={this.refreshData}>Refresh</button>
                <table style={{ margin: '0 auto 0 auto' }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>Answered?</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.questions.map((question, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{question}</td>
                                <td>{this.state.answers[index].length === 0 ? 'No' : 'Yes'}</td>
                                <td>
                                    <Link
                                        to={{
                                            pathname: '/question',
                                            state: {
                                                questionId: this.state.questionIds[index],
                                                sessionId: this.props.sessionId,
                                                ownerId: this.props.ownerId,
                                            },
                                        }}
                                    >
                                        Link
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}
