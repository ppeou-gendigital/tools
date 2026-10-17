import {useStore} from '../../../context/profile';
import FileUpload from '../file-upload';
import {addProfile, setProfile} from '../../../context/profile/action';
import FileService from '../../../context/file/file';
import FileDownload from '../file-download';
import {Fragment} from 'react';

const ProfileList = () => {
  const [{profile}, dispatch] = useStore();
  const onFileUpload = (e) => {
    const {info, value} = e;
    let id = info.name;
    FileService.save(id, value);
    dispatch(addProfile({id, name: id, uploadTime: new Date()}));
    if(profile.list.length === 0) {
      dispatch(setProfile({selected: id}));
    }
  };

  const removeProfile = (toBeRemoveIdx) => () => {
    const profileToBeRemoved = profile.list[toBeRemoveIdx];
    if(profileToBeRemoved) {
      const newProfiles = profile.list.filter((_, idx) => idx !== toBeRemoveIdx);
      dispatch(setProfile({list: newProfiles}));
      FileService.remove(profileToBeRemoved.id);
      if(profile.selected === profileToBeRemoved.id) {
        const newSelectedProfile = (newProfiles[newProfiles.length - 1] || {id: ''}).id;
        dispatch(setProfile({selected: newSelectedProfile}));
      }
    }
  };

  const setDefaultProfile = (profileId) => () => {
    dispatch(setProfile({selected: profileId}));
  };

  return (
    <>
    <div className="content is-normal">
      <h1>Profiles</h1>
      <div className="fixed-grid">
        <div className="grid" style={{gridTemplateColumns: '1fr auto'}}>
          {(profile.list || []).map(({id, name}, idx) => (<Fragment key={idx}>
            <div className={`cell ${id === profile.selected && 'has-text-link'}`}>
              {id === profile.selected && <i className="fas fa-check-square"></i>} {name}
            </div>
            <div className="cell buttons is-right are-small" style={{marginBottom: 0}}>
              <button className="button is-danger" title="Remove profile" onClick={removeProfile(idx)}>✗</button>
              <button className="button is-link" title="Set profile as default" onClick={setDefaultProfile(id)}>✓</button>
              <FileDownload title="Export profile" className="button is-dark" label="⇩" fileName={id} fileContent={FileService.load(id)} />
            </div>
          </Fragment>))}
        </div>
      </div>
    </div>
      <div className="section">
        <FileUpload label="Add New Profile" onChange={onFileUpload}/>
      </div>
  </>
  );
};

export default ProfileList;
//<FileDownload label="Download" fileName="config.data.json" fileContent={state}>Download</FileDownload>
