import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import UploadPage from './pages/UploadPage/UploadPage';
import FilePage from './pages/FilePage/FilePage';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from './store/store';



function App() {
    const isLoading = useAppSelector(state => state.upload.isLoading || state.file.isLoading);
    const loadingMessage = useAppSelector(state => state.upload.loadingMessage || state.file.loadingMessage);
    return (
      <div>
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
          <Backdrop
            open={isLoading}
          >
          <CircularProgress color="inherit" />
          <div className="loading-message">{loadingMessage}</div>
        </Backdrop>
      </div>
    )

}

export default App;
