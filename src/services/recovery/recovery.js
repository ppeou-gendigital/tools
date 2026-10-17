import React, {useEffect, useState} from 'react';
import {pushToDownload} from '../download/download';


const RecoveryView = () => {

  const exportData = () => {
    Object.entries(window.localStorage).forEach(([k,v], idx) => {
      setTimeout(() => {
        pushToDownload({name: k, data: v});
      }, 100 * idx);
    });
  };

  const resetExtension = () => {
    if(chrome && chrome.runtime) {
      Object.entries(localStorage).forEach(([k]) => {
        localStorage.removeItem(k);
      });
      chrome.runtime.reload();
    }
  };

  return (
    <section className="page">
    <section className="content is-normal">
      <h1>Unexpected Error Occur</h1>
      <div className="fixed-grid">
        <div className="grid" style={{gridTemplateColumns: '1fr auto'}}>
          <div className="cell">Export Data</div>
          <div className="cell">
            <button className="button is-small is-dark is-fullwidth" onClick={exportData}>Export</button>
          </div>

          <div className="cell">Reset Extension</div>
          <div className="cell">
            <button className="button is-small is-danger is-fullwidth" onClick={resetExtension}>Reset</button>
          </div>
        </div>
      </div>
    </section>
    </section>
  );
};

class RecoveryService extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error-reporting service
    console.log('componentDidCatch', error, info);
  }

  render() {
    if (this.state.hasError) {
      return <RecoveryView />;
    }

    return this.props.children;
  }
}

export default RecoveryService;
