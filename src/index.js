import React from "react";
import ReactDOM from "react-dom";
import { HotTable } from "@handsontable/react";
import ReactDropzone from "react-dropzone";
import WebSheetLoader from "./websheetLoader";
import "./index.css";

class WebSheetComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      websheet: null
    };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(acceptedFiles) {
    var file = acceptedFiles[0];
    var setState = this.setState.bind(this);
    var loader = new WebSheetLoader();
    loader.load(file).then(function(websheet) {
      setState({
        selectedFile: file,
        websheet: websheet
      });
      console.table(websheet.to2DArray());
    });
  }

  render() {
    if (this.state.selectedFile === null) {
      return (
        <section className="websheet-dropzone-container">
          <h1>Try it out</h1>
          <ReactDropzone className="websheet-dropzone" onDrop={this.onDrop}>
            {" "}
            Drop excel files here!!
          </ReactDropzone>
        </section>
      );
    } else {
      return (
        <HotTable
          className="websheet-content"
          data={this.state.websheet.to2DArray()}
          colHeaders={true}
          rowHeaders={true}
          stretchH="all"
        />
      );
    }
  }
}

class App extends React.Component {
  render() {
    return (
      <div className="websheet-app">
        <WebSheetComponent />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
