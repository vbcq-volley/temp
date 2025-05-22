
var React = require('react')

var Rendered = React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    type:React.PropTypes.string
  },
  render: function () {
    if(this.props.type=="post"){
      return this.transferPropsTo(
      <div className="post-content"
        dangerouslySetInnerHTML={{
          __html: this.props.text || '<h1 class="editor_no-content">There doesn\'t seem to be anything here</h1>'
        }}/>)
    }
    if(this.props.type=="match"){
      return this.transferPropsTo(
      <div className="post-content"
        dangerouslySetInnerHTML={{
          __html: this.props.text || '<h1 class="editor_no-content">There doesn\'t seem to be anything here</h1>'
        }}/>)
    }
    if(this.props.type=="team"){
      return this.transferPropsTo(
      <div className="post-content"
        dangerouslySetInnerHTML={{
          __html: this.props.text || '<h1 class="editor_no-content">There doesn\'t seem to be anything here</h1>'
        }}/>)
    }
  }
})

module.exports = Rendered;
