import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import { Doc, DocView } from './Doc';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      docs: [new Doc(32, 32)]
    };
  }

  render() {
    var docs = this.state.docs.map((d) => <DocView doc={d} />);
    return <div>{docs}</div>
  }
}


ReactDOM.render(<App />, document.getElementById('root'));