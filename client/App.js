import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { hot } from 'react-hot-loader';
import io from 'socket.io-client';
import styles from './App.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';


const socket = io('/');

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            messages: [],
            text: '',
            name: ''
        };
    }

    componentDidMount() {
        socket.on('message', message => this.messageReceive(message));
        socket.on('update', ({ users }) => this.chatUpdate(users));
    }

    

    // messageReceive(message) {
    //     const size = 30
    //     if (this.state.messages.length > size) {
    //         const messages = [...this.state.messages.slice(1, size + 1), message];
    //         this.setState({ messages });
    //     } else {
    //         const messages = [...this.state.messages, message];
    //         this.setState({ messages });
    //     }
    // }

    messageReceive(message) {
        const messages = [message, ...this.state.messages];
        this.setState({messages});
      }




    chatUpdate(users) {
        this.setState({ users });
    }



    // handleMessageSubmit(message) {
    //     const size = 30
    //     if (this.state.messages.length > size) {
    //         const messages = [...this.state.messages.slice(1, size + 1), message];
    //         this.setState({ messages });
    //         socket.emit('message', message);
    //     } else {
    //         const messages = [...this.state.messages, message];
    //         this.setState({ messages });
    //         socket.emit('message', message)
    //     }
    // }

    handleMessageSubmit(message) {
        const messages = [message, ...this.state.messages];
        this.setState({messages});
        socket.emit('message', message);
      }


      


    handleUserSubmit(name) {
        this.setState({ name });
        socket.emit('join', name);
    }

    

    render() {
        return this.state.name !== '' ? (
          this.renderLayout()
        ) : this.renderUserForm() // zaimplementowane w późniejszej części
      }



    renderLayout() {
        return (
            <div className={styles.App}>
                <div className={styles.AppHeader}>
                    <div className={styles.AppTitle}>
                        ChatApp
          			</div>
                    <div className={styles.AppRoom}>
                        App room
          			</div>
                </div>
                <div className={styles.AppBody}>
                    <UsersList
                        users={this.state.users}
                    />
                </div>
                <div className={styles.MessageWrapper}>
                    <MessageList
                        messages={this.state.messages}
                    />
                    <MessageForm
                        onMessageSubmit={message => this.handleMessageSubmit(message)}
                        name={this.state.name}
                    />
                </div>
            </div>
        );
    }



    renderUserForm() {
        return (<UserForm onUserSubmit={name => this.handleUserSubmit(name)} />)
    }
}

export default hot(module)(App);