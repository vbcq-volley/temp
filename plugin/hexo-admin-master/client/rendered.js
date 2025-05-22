var React = require('react')

var styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px'
  },
  title: {
    color: '#333',
    borderBottom: '2px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px'
  },
  info: {
    backgroundColor: '#f9f9f9',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '15px'
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
    marginRight: '10px'
  },
  score: {
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '20px 0',
    color: '#2c3e50'
  },
  separator: {
    margin: '0 15px',
    color: '#95a5a6'
  },
  jsonContent: {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '5px',
    border: '1px solid #e9ecef',
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    overflow: 'auto',
    maxHeight: '400px'
  },
  postponed: {
    color: '#e74c3c',
    fontWeight: 'bold',
    textAlign: 'center',
    margin: '10px 0'
  },
  description: {
    marginTop: '20px',
    lineHeight: '1.6'
  }
};

var Rendered = React.createClass({
  propTypes: {
    text: React.PropTypes.string,
    type: React.PropTypes.string,
    team1: React.PropTypes.string,
    team2: React.PropTypes.string,
    team1Score: React.PropTypes.string,
    team2Score: React.PropTypes.string,
    homeDate: React.PropTypes.string,
    awayDate: React.PropTypes.string,
    homeLocation: React.PropTypes.string,
    awayLocation: React.PropTypes.string,
    group: React.PropTypes.string,
    teamName: React.PropTypes.string,
    coach: React.PropTypes.string,
    isPostponed: React.PropTypes.bool
  },

  parseJsonText: function(text) {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  },

  renderMatch: function() {
    const textContent = this.parseJsonText(this.props.text);
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>{this.props.team1} vs {this.props.team2}</h2>
        <div style={styles.info}>
          <p><span style={styles.label}>Groupe:</span> {this.props.group}</p>
          <p><span style={styles.label}>Match à domicile:</span> {this.props.homeDate || 'Non défini'}</p>
          <p><span style={styles.label}>Lieu domicile:</span> {this.props.homeLocation || 'Non défini'}</p>
          <p><span style={styles.label}>Match à l'extérieur:</span> {this.props.awayDate || 'Non défini'}</p>
          <p><span style={styles.label}>Lieu extérieur:</span> {this.props.awayLocation || 'Non défini'}</p>
        </div>
        {textContent && (
          <div style={styles.description}>
            <div style={styles.jsonContent}
              dangerouslySetInnerHTML={{
                __html: typeof textContent === 'string' ? textContent : JSON.stringify(textContent, null, 2)
              }}
            />
          </div>
        )}
      </div>
    )
  },

  renderResult: function() {
    const textContent = this.parseJsonText(this.props.text);
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>{this.props.team1} vs {this.props.team2}</h2>
        <div style={styles.info}>
          <div style={styles.score}>
            <span>{this.props.team1Score}</span>
            <span style={styles.separator}>-</span>
            <span>{this.props.team2Score}</span>
          </div>
          <p><span style={styles.label}>Groupe:</span> {this.props.group}</p>
          {this.props.isPostponed && <p style={styles.postponed}>Match reporté</p>}
        </div>
        {textContent && (
          <div style={styles.description}>
            <div style={styles.jsonContent}
              dangerouslySetInnerHTML={{
                __html: typeof textContent === 'string' ? textContent : JSON.stringify(textContent, null, 2)
              }}
            />
          </div>
        )}
      </div>
    )
  },

  renderTeam: function() {
    const textContent = this.parseJsonText(this.props.text);
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>{this.props.teamName}</h2>
        <div style={styles.info}>
          <p><span style={styles.label}>Entraîneur:</span> {this.props.coach}</p>
          <p><span style={styles.label}>Groupe:</span> {this.props.group}</p>
        </div>
        {textContent && (
          <div style={styles.description}>
            <div style={styles.jsonContent}
              dangerouslySetInnerHTML={{
                __html: typeof textContent === 'string' ? textContent : JSON.stringify(textContent, null, 2)
              }}
            />
          </div>
        )}
      </div>
    )
  },

  render: function () {
    const textContent = this.parseJsonText(this.props.text);
    
    switch(this.props.type) {
      case "match":
        return this.renderMatch();
      case "result":
        return this.renderResult();
      case "team":
        return this.renderTeam();
      case "post":
        return (
          <div style={styles.container}>
            <div style={styles.jsonContent}
              dangerouslySetInnerHTML={{
                __html: textContent ? 
                  (typeof textContent === 'string' ? textContent : JSON.stringify(textContent, null, 2)) : 
                  '<h1 class="editor_no-content">Il n\'y a pas de contenu ici</h1>'
              }}
            />
          </div>
        );
      default:
        return (
          <div style={styles.container}>
            <h1 style={styles.title}>Type de contenu non reconnu</h1>
          </div>
        );
    }
  }
})

module.exports = Rendered;
