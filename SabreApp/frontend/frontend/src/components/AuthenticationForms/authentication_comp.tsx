import { useState } from 'react';
import { buildPath } from '../../../../../backend/utils';

const AuthForm = () =>
{
    const [email, setEmail] = useState(String);
    const [password, setPassword] = useState(String);


    const handleSetEmail = (e:any) =>
    {
        setEmail(e.target.value);
    }
    const handleSetPassword = (e:any) =>
    {
        setPassword(e.target.value);
    }

    const doLogin = async (event:any) =>
    {
        event.preventDefault();
        console.log(email);
        console.log(password);
        let obj = {email : email, password : password};
        let js = JSON.stringify(obj);
        try
        {
            const response = await fetch(buildPath('/api/users/loginUser'),
                {method: 'POST', body: js, headers:{'Content-Type' : 'application/json'}})
            //var res = JSON.parse(await response.text());
            if(response.status == 201)
                window.location.href = '/devices';
        }
        catch(error : any)
        {
            alert(error.toString());
            return;
        }
    }



    return (
        <div>
            <span>
                Email
                <input onChange={handleSetEmail}>
                </input>
            </span>
            <span>
                Password
                <input onChange={handleSetPassword}>
                </input>
            </span>
            <button onClick={doLogin}>
                Submit
            </button>
        </div>

    );
}

export default AuthForm;