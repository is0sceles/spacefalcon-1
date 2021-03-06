import React from 'react';
import Post from './Post.js'
import {connect} from 'react-redux';
import {Link} from 'react-router'
import {fetchCategories} from '../actions/category_actions.js'
import { fetchPostsFromDb, filterPosts, filterTagsfromDb, clearPosts} from '../actions/post_actions.js'
import NewPostForm from './NewPost.js'

class Browse extends React.Component {

  constructor (props) {
    super()
    this.state = {
      filter: [],
      filtering: false
    }
  }

  componentWillMount() {
    this.props.dispatch(fetchPostsFromDb());
    if(this.props.categories.length === 0) {
      this.props.dispatch(fetchCategories());
    }
  }

  filter (e) {
    e.preventDefault()
    if(!this.state.filtering){
      this.props.dispatch(clearPosts()) //clear initial all results to prevent dupes
      this.setState({filtering: true})
    }

    let search = this.props.categories.filter((category) => {
      return this.refs.search.value === category.name
    })[0]

    if(!search && this.state.filter.indexOf(this.refs.search.value) === -1) {
      this.props.dispatch(filterTagsfromDb(this.refs.search.value))
    }

    if(search && this.state.filter.indexOf(this.refs.search.value) === -1){
      this.props.dispatch(filterPostsFromDb(search.id))
    }

    this.setState({filter: this.state.filter.concat(this.refs.search.value)})
    this.refs.search.value = "";
  }

  clearFilter () {
    this.setState({filter: [], filtering: false})
    this.props.dispatch(fetchPostsFromDb())
  }

  render () {
    const {category} = this.props.params
    const filtered = category === undefined ? this.props.allPosts :
    this.props.allPosts.filter(post => post.category.name === category);
    const CARDS = {
      float:'left',
      paddingLeft:'10px',
    }
    const FILTER = {paddingBottom: '50px'}
    return (
    <div className="col-md-10">
     <div className="row">
      <div className="col-md-8">
        <h1>Browse</h1>
          <div style={FILTER}>
            {
              this.props.categories.map((category, index) =>
                (
                  <div key={index} className="form-check">
                  <label className="form-check-label" style={CARDS}>
                    <Link activeStyle={{
                      color: '#FFF',
                      background: '#0DD5FF',
                      padding: '2px 2px 2px 2px'
                    }} to={'/browse/' + this.props.user.username + '/' + category.name}>
                    {category.name}</Link>
                  </label>
                </div>
                )
              )
            }
          </div>
          <NewPostForm {...this.props} />
          <div className="row">
            { filtered.map((post, index) => {
                return (
                  <Post key={index} dispatch={this.props.dispatch}
                    post={post} user={this.props.user} />
                )
              })
            }
          </div>
         </div>
       </div>
      </div>
    )
  }
}

export default Browse;