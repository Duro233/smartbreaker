import getUser from '../routes/getuser';

export default function HomePage()
{
  const userInfo = getUser();
  console.log(userInfo);
  return (
    <div>
      <h2>Home Page</h2>
        <h2>{userInfo?.first} {userInfo?.last}</h2>
    </div>
  );
} 