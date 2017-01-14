import React from 'react'
import PubNub from 'pubnub'
// import _ from 'underscore'
import {browserHistory, refresh} from 'react-router'
import UserPic from './userPicture.js'

class Message extends React.Component {

  constructor(props) {
    super()
    this.state = {
      messageHistory: [<div key='loading'> LOADING </div>],
      usersHistory: [<div key='loadingHistory'> LOADING </div>],
      usersHistory_names: null,
      channelName: null,
      historyChannel: null
    }
  }

  componentWillMount () {
    this.setState({channelName: [this.props.params.user, this.props.user.username].sort().join("")})
    this.setState({historyChannel: this.props.user.username + 'history'})
  }

  handleNewMessage (message) {
    //concat new messages to state
    let temp = this.state.messageHistory
    .concat([ //EXTERNALIZE TO AN ENTRY
      <div key={Math.random()}>
        <UserPic username={message.username} />
        {message.text}
      </div>
    ])
    .slice(this.state.messageHistory.length -9)
    //fix the slice part
    this.setState({
      messageHistory: temp
    })
  }

  componentDidMount () {
    this.pubnub = new PubNub({
        publishKey: 'pub-c-f5e1b611-9e28-4b7a-85bc-53d8ffb17f95',
        subscribeKey: 'sub-c-45dd39e4-d8ee-11e6-a0b3-0619f8945a4f',
    })
    this.pubnub.addListener({
      message: (m) => {
        this.handleNewMessage(m.message)
      }
    })
    this.pubnub.subscribe({
      channels: [this.state.channelName]
    })
    this.refresh()
  }

  componentWillUnmount () {
    this.pubnub.unsubscribeAll()
  }

  publish (e) {
    e.preventDefault()
    //send message
    this.pubnub.publish({
      channel: this.state.channelName,
      message: {
        username: this.props.user.username,
        text: this.refs.message.value
      } //this.props.user.username + ": " + this.refs.message.value
    }, (status, response) => {
      this.refs.message.value = ""
    })
    //add to convo history
    if (this.state.usersHistory_names.indexOf(this.props.params.user) === -1) { //check if not already in history
      this.pubnub.publish({ //publish to your conversation history
        channel: this.state.historyChannel,
        message: this.props.params.user
      })
      this.pubnub.publish({ //publish to other user's conversation history
        channel: this.props.params.user + 'history',
        message: this.props.user.username
      })
      this.setState({usersHistory_names: this.state.usersHistory_names.concat(this.props.params.user)})
    }
  }

  refresh () {
    this.pubnub.history( //fetch past messages
      {
        channel: this.state.channelName,
        reverse: false,
        count: 10,
      },
      (status, response) => {
        if(response === undefined) {
          console.log("empty conversation res")
          return
        } else {
          this.setState({messageHistory: response.messages.map((message) => { //map messages
              return ( //EXTERNALIZE TO AN ENTRY
                <div key={Math.random()}>
                  <UserPic username={message.entry.username} />
                  {message.entry.text}
                </div>
              )
            })
          })
        }
    })
    this.pubnub.history({ //fetch past convos
      channel: this.state.historyChannel,
      reverse: false,
      count: 10
    }, (status, response) => {
      if (response === undefined) {
        console.log('empty message history res')
        return
      } else {
        this.setState({usersHistory: response.messages.map((message) => { //map past convos
          if(message.entry !== " ") {
            return (
              <div key={Math.random()} onClick={this.navToMessage.bind(this, message.entry)}>
                <UserPic username={message.entry} />
                {message.entry}
              </div>
            )
          }
          })
        })
        this.setState({usersHistory_names: response.messages.map((message) => { //set past convos in state
          return message.entry
        })})
      }
    })
  }

  navToMessage (user) {
    browserHistory.push('/message/' + user)
    location.reload();
    //RE RENDER THIS PAGE IDIOT.
  }

  showConversation () {
    if(this.props.user.username === this.props.params.user) {
      return (
        <div className="col-md-6">
          <h1>Select a conversation</h1>
        </div>
      )
    } else {
      return (
        <div className="col-md-6">
          <div className="header">
            <h1>Messages</h1>
            <UserPic username={this.props.params.user} />
            <UserPic username={this.props.user.username} />
          </div>
          <div style={{
            height: 300,
            overflow: 'scroll'
          }}>
            {this.state.messageHistory}
          </div>
          <form onSubmit={this.publish.bind(this)}>
            <input type="text" ref="message"></input>
            <button>send</button>
          </form>
        </div>
      )
    }
  }

  render () {
    return (
      <div>
        <div className="col-md-4">
          <h2>All Conversations</h2>
          {this.state.usersHistory}
        </div>
        {this.showConversation()}
      </div>
    )
  }
}

export default Message