import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import Seed from '../../seed.js'
// import Tags from './tagsComponent.jsx'
import {addTag, removeTag} from '../../actions/tagActions.js'

class NewInterest extends React.Component {

  handleSubmit(e) {
    e.preventDefault();
    const description = this.refs.description.value;
    const category = this.refs.category.value;
    const title = this.refs.title.value
    let userData = {title, description, category}
    console.log(userData)
    this.refs.interests.reset();
  }

  handleTag(toggle, str, e) {
    e.preventDefault();

    if(toggle === "add"){
      this.props.addTag(this.refs.tags.value);
    }

    if(toggle === "remove"){
      this.props.removeTag(str.tag);
    }

    this.refs.tags.value = "";
  }

  render () {

    let options = Seed.choices.map((choice) => {
      return <option key={choice}>{choice}</option>
    })

    let domTags = this.props.tags.map((tag) => {
      //make a custom 4 dis
      //or map to props somewhere else
      return <p key={tag} onClick={this.handleTag.bind(this, "remove", {tag})}> {tag} </p>
    })

    return (
      <div>
        <form ref="interests" onSubmit={this.handleSubmit.bind(this)}>
          <input type="text" ref="title" placeholder="title"></input>
          <br />
          <textarea ref="description" rows="5" cols="30">
          </textarea>
          <br />
          <input ref="tags" type="text" placeholder="add a tag"></input>
          <button onClick={this.handleTag.bind(this, "add", null)}>add tag</button>
          <div>
            {domTags}
          </div>
          <br />
          category:
          <select ref="category">
            {options}
          </select>
          <button>CREATE</button>
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    tags: state.tags.tags
  };
}

function matchDispatchToProps(dispatch){
  return bindActionCreators({
    addTag,
    removeTag
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(NewInterest);