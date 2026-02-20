import getUser from '../routes/getuser';
import { NavbarSimple } from '../components/NavbarSimple';
//import '../styles/theme.css';

export default function HomePage()
{
  const userInfo = getUser();
  console.log(userInfo);
  
  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--app-bg)' }}>
      <NavbarSimple />
      <main style={{ flex: 1, padding: '2rem'}}>
        <h2>{userInfo?.first} {userInfo?.last}</h2>
        <h3>Smartbreaker Details</h3>
        {/*details on the smartbreaker*/}
        <h4>Set Up Instructions</h4>
        {/*info on how to setup the smartbreaker*/}
      </main>
    </div>
  );
} 
