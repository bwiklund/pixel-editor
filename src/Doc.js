import React from 'react';

export class Doc {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    this.pixels = new Array([width * height * 4]).fill(0);
  }
}

export class DocView extends React.Component {
  render() {
    return <p>Hi</p>
  }
}
