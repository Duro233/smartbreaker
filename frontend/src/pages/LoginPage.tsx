import { useState } from 'react';
import { loginUser } from '../routes/auth';

import { Button, Stack, TextInput, PasswordInput} from '@mantine/core';
import { useForm } from '@mantine/form';

import Navigation from '../components/home-comp/navigation/login-navigation';
import Background from '../components/background/Background';
import { useScrollReveal } from '../hooks/useScrollReveal';

//import classes from '../../src/index.css';
//import '../index.css';

export default function Login() {
  useScrollReveal();
  const [submitError, setSubmitError] = useState('');
  
  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: ''
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6) ? 'Password should includde at least 6 chars' : null
    },
  });

  const handleSubmit = async (values : any) => {
    console.log(values);
    setSubmitError('');
    try {
      const res = await loginUser(values);
      localStorage.setItem('token', res.data.token);
      console.log(res.data.token);

      console.log(res);

      if(res.status === 200)
      {
        console.log("Login Success");
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegisterRedirect = () =>
  {
    window.location.href = '/register';
  }
  
return (
    <div>
    <div>
        <Navigation />
    </div>
  <div>  
    <form data-reveal onSubmit={form.onSubmit((values) => handleSubmit(values))} className='form-borders' style={{padding : '65px 35px 50px 35px'}}>
        <TextInput
        withAsterisk
        label="Email"
        placeholder="your@email.com"
        classNames={{ input : 'prim-text-fields'}}
        key={form.key('email')}
        {...form.getInputProps('email')}
      />

      <PasswordInput
        withAsterisk
        label="Password"
        placeholder="password"
        classNames={{ input : 'prim-text-fields'}}
        key={form.key('password')}
        {...form.getInputProps('password')}
      />

     {/* <Checkbox
        mt="md"
        label="Test Thing, might get rid of"
        key={form.key('termsOfService')}
        {...form.getInputProps('termsOfService', { type: 'checkbox' })}
      /> */}

      <Stack justify="center" align='center' gap='xs' mt="md">
        <Button variant="primary" type="submit">Login</Button>
        <Button variant="secondary" onClick={handleRegisterRedirect}>Get Registered</Button>
      </Stack>
      {submitError ? <p className="auth-form-error">{submitError}</p> : null}
    </form>
    <Background />
    </div>
    </div>
  );
}
