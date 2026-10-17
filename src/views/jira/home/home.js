import {Outlet} from "react-router";
import Nav from '../nav/nav';
import {useStore} from '../../../context/profile';

const Home = () => {
  const [{profile}] = useStore();

  return profile.selected ?
    (<><Nav/>
      <section className="page">
        <Outlet/>
      </section>
    </>)
    : <h4>Please load/select a profile</h4>;
};
export default Home;
