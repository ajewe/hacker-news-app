import React from 'react';
import './App.css';
import leftPad from 'left-pad';

class App extends React.Component {
  state = {
    searchInput: '',
    searchCriteria: 'author',
    searchHits: [],
    submitClicked: false,
  }

  fetchByAuthor(userInput){
    fetch(`http://hn.algolia.com/api/v1/search?tags=story,author_${userInput}`)
    .then(response => response.json())
    .then(parsedJSON => parsedJSON.hits.map(hit => (
      {
        title: `${hit.title}`,
        author: `${hit.author}`,
        date:`${hit.created_at}`,
        url: `${hit.url}`,
      }
    )))
    .then(searchHits => this.setState({
      searchHits,
    }))
    .catch(error => console.log('parsing failed', error))
  }

  fetchByStory(userInput) {
    fetch(`https://hn.algolia.com/api/v1/search?query=${userInput}&tags=story`)
    .then(response => response.json())
    .then(parsedJSON => parsedJSON.hits.map(hit => (
      {
        title: `${hit.title}`,
        author: `${hit.author}`,
        date:`${hit.created_at}`,
        url: `${hit.url}`,
      }
    )))
    .then(searchHits => this.setState({
      searchHits: searchHits
    }))
    .catch(error => console.log('parsing failed', error))
  }

  handleChange = (event) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value})
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState ({    
      searchInput: '',
      searchCriteria: 'author',
      submitClicked: true,
    })

    if (this.state.searchCriteria === 'author') {
      this.fetchByAuthor(this.state.searchInput)
    } else {
      this.fetchByStory(this.state.searchInput)
    }
  }

  render() {
    return (
      <div className="App">
        <h1>Hacker News</h1>
        <h2>Search:</h2>
        <form onSubmit={this.handleSubmit}>
          <label> 
          <input name="searchInput" value={this.state.searchInput} onChange={this.handleChange}></input>
          </label>
          <label style={{margin: "10px"}}> by
            <select name="searchCriteria" value={this.state.searchCriteria} onChange={this.handleChange} style={{margin: "10px"}}>
              <option value="author">Author (exact)</option>
              <option value="story">Story (containing)</option>
            </select>
          </label>
          <br />
          <button>Submit</button>
        </form>
        <div>
          {this.state.submitClicked && 
            <h1 style={{textAlign: "left", margin: "20px"}}>Results:</h1>
          }
          {this.state.searchHits.map((item, index) => {
            return (<StoryItem 
              key={index}
              title={item.title}
              author={item.author}
              date={item.date}
              url={item.url}
            />
            )
          })}
        </div>
      </div>
  );
  }
}

function StoryItem(props) {
  return (
    <div style={{textAlign: 'left', margin: "20px"}}>
      <h2>Title: {props.title}</h2>
      <h3>Author: {props.author}</h3>
      <h3>Date: {props.date}</h3>
      <a href={props.url}>{props.url}</a>
    </div>
  )
}

export default App;
