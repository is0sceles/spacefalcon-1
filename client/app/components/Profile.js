import React from 'react';
import {browserHistory} from 'react-router'
import {connect} from 'react-redux';
import Post from './Post.js'
import NewPostForm from './NewPost.js'

import {fetchCategories} from '../actions/category_actions.js'
import {fetchUserPostsFromDb} from '../actions/post_actions.js'

class Profile extends React.Component {
  componentWillMount() {
    if(this.props.params.username !== this.props.user.username){ //if does not match logged in user
      console.log('PUBLIC')
      browserHistory.push('/profile/' + this.props.params.username) //reroute to a public profile
    }
    if(this.props.categories.length === 0) {
      this.props.dispatch(fetchCategories());
    }
  }

  render () {
    let sorted = this.props.userPosts.sort((a,b) => {
      return a.id < b.id
    })
    return (
      <div className="col-md-6">
        <NewPostForm {...this.props} />
          { sorted.map((post) => {
              return (
                <Post key={post.id} post={post} />
              )
            })
          }
      </div>
    )
  }
}

export default Profile;



// class ProfileComponent extends React.Component {

//   constructor (props) {
//     super()
//     this.state = {
//       toggle: 'Interest'
//     }
//   }

//   toggle () {
//     this.state.toggle === 'Interest' ?
//     this.setState({toggle: 'Entry'}) :
//     this.setState({toggle: 'Interest'})
//   }

//   createNewPost () {
//     if (this.state.toggle === 'Interest') {
//       return (
//         <div>
//           <NewInterest />
//           <h4 onClick={this.toggle.bind(this)}>switch to entry</h4>
//         </div>
//       )
//     } else {
//       return (
//         <div>
//           <NewEntry />
//           <h4 onClick={this.toggle.bind(this)}>switch to interest</h4>
//         </div>
//       )
//     }
//   }

//   profilePicture () {
//     if (!this.props.user.profilePicture) { //fix later
//       return (
//         <i className ="fa fa-user-o fa-5x"></i>
//       )
//     } else {
//       return (
//         <img src={this.props.user.profilePicture}  />
//       )
//     }
//   }

//   editOrView () {
//     //todo
//     //add method to check if user exists
//     //add user not found render

//     if(this.props.user.username !== this.props.params.username) {
//       return (
//         <div>
//           <h1>{this.props.params.username}'s Profile</h1>
//           {this.profilePicture()}
//           <br />
//           <button className="btn btn-primary">Message {this.props.params.username}</button>
//           <h2>{this.props.params.username}'s posts</h2>
//           <Interests username={this.props.params.username} / >
//         </div>
//       )
//     } else {
//       return (
//         <div>
//           <h1>Your Profile</h1>
//           {this.profilePicture()}
//           <h2>create a new {this.state.toggle}</h2>
//           {this.createNewPost()}
//           <h2>my posts</h2>
//           <Interests username={this.props.params.username} / >
//         </div>
//       )
//     }
//   }

//   render () {
//     return (
//       <div>
//         {this.editOrView()}
//       </div>
//     )
//   }
// }