import getUser from '../routes/getuser';
//import '../styles/theme.css';

export default function HomePage()
{
  const userInfo = getUser();
  console.log(userInfo);
  return (
    <div style={{background: 'var(--app-bg)'}}>
      <h2>Home Page</h2>
        <h2>{userInfo?.first} {userInfo?.last}</h2>
        <h3>I am gay</h3>
    </div>
  );
} 