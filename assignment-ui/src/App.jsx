import './App.css';
import { BrowserRouter as Router, Route, Switch,Redirect } from "react-router-dom";
import React from 'react';
import UploadPage from './pages/UploadPage/UploadPage';
import { Loading } from "element-react";
import { connect } from 'react-redux';
import FilePage from './pages/FilePage/FilePage';



class App extends React.Component {
  constructor() {
    super();
  }
  render() {

    return (
      <Loading className="loader"
        loading={this.props.isLoading}
        text={this.props.loadingMessage}
      >
        <Router>
          <Switch>
            <Route exact={true} path="/upload">
              <UploadPage />
            </Route>
            <Route exact={true} path="/file/:id">
              <FilePage />
            </Route>
            <Route path="*">
              <Redirect to="/upload" />
            </Route>
          </Switch>
        </Router>
      </Loading>

    );
  }

}

const mapStateToProps = (state) => ({
  isLoading: state.upload.isLoading || state.file.isLoading,
  loadingMessage: state.upload.loadingMessage || state.file.loadingMessage
});


export default connect(mapStateToProps)(App);
