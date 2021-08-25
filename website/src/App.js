import React from 'react';
import './App.css';
import AskQuestion from './components/AskQuestion';
import CreateSession from './components/CreateSession';
import DisplayQuestions from './components/DisplayQuestions';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import AnswerQuestion from './components/AnswerQuestion';

class Home extends React.Component {
    state = {
        sessionId: '',
        ownerId: '',
    };
    render() {
        return (
            <div>
                <CreateSession
                    onCreate={(sessionId, ownerId) => this.setState({ sessionId: sessionId, ownerId: ownerId })}
                ></CreateSession>
                <p>
                    <label>Session Id:</label>
                    <input
                        type="text"
                        value={this.state.sessionId}
                        onChange={(event) => this.setState({ sessionId: event.target.value })}
                    ></input>
                </p>
                <AskQuestion sessionId={this.state.sessionId}></AskQuestion>
                <DisplayQuestions sessionId={this.state.sessionId} ownerId={this.state.ownerId}></DisplayQuestions>
            </div>
        );
    }
}
class App extends React.Component {
    render() {
        return (
            <Router>
                <div className="App">
                    <Switch>
                        <Route exact path="/">
                            <Home></Home>
                        </Route>
                        <Route path="/question" component={AnswerQuestion}></Route>
                    </Switch>
                </div>
                ;
            </Router>
        );
    }
}

export default App;
