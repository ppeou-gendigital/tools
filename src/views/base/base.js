import {BrowserRouter, Routes, Route} from 'react-router';
import useJiraRoutes from '../jira/routes';
import Nav from '../../comps/nav/nav';

import './base.scss';
import Store from '../../context/store';
import ProfileProvider, {useStore as useProfile} from '../../context/profile';

import Config from '../config/config';
import CommunicationService from '../../services/message/message';
import createStorage from '../../context/shared/storage';
import FileService from '../../context/file/file';
import {useEffect} from 'react';
import A11yService from '../../services/a11y/a11y';
import RecoveryService from '../../services/recovery/recovery';

const ContentView = () => {
  const JiraRoute = useJiraRoutes();

  return (<BrowserRouter>
    <Nav/>
    <Routes>
      <Route path="/" element={<Config/>}/>
      {JiraRoute}
      <Route path="profiles" element={<Config/>}/>
    </Routes>
  </BrowserRouter>);
};

const Wrapper = () => {
  const [{profile}] = useProfile();
  const tempProfileId = 'TMP';
  const db = createStorage(FileService.getFileIdByName(profile.selected || tempProfileId));
  useEffect(() => {
    if (profile.selected) {
      FileService.remove(tempProfileId);
    }
  }, [profile.selected]);
  return (<Store db={db}>
    <ContentView/>
  </Store>);
}

const Base = () => {
  return (
    <RecoveryService>
      <CommunicationService/>
      <ProfileProvider>
        <A11yService />
        <Wrapper/>
      </ProfileProvider>
    </RecoveryService>
  );
};

export default Base;
