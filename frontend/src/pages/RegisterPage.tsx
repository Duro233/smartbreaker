import { registerUser } from '../routes/auth';
import { useState } from 'react';

import { Button, Group, Stack, TextInput, PasswordInput} from '@mantine/core';
import { useForm } from '@mantine/form';

import Navigation from '../components/home-comp/navigation/login-navigation';
import Background from '../components/background/Background';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function Register() {
  useScrollReveal();
  const [submitError, setSubmitError] = useState('');

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: ''
    },

    validate: {
      firstName: (value) => (value.trim().length === 0 ? 'First name is required' : null),
      lastName: (value) => (value.trim().length === 0 ? 'Last name is required' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6) ? 'Password should includde at least 6 chars' : null
    },
  });

  const handleSubmit = async (values : any) => {
    setSubmitError('');
    try {
      const res = await registerUser(values);
      if(res.status === 201)
      {
        console.log("Registration Success");
        window.location.href = '/home';
      }
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Registration failed');
    }
  };

  const handleLoginRedirect = () =>
  {
    window.location.href = '/login';
  }

  return (
    <div>
      <div>
        <Navigation />
      </div>
      <div>
      <form data-reveal onSubmit={form.onSubmit((values) => handleSubmit(values))} className='form-borders register-form-area'>
        <TextInput
          className="register-form-input"
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          classNames={{ input : 'prim-text-fields'}}
          key={form.key('email')}
          {...form.getInputProps('email')}
        />

        <PasswordInput
          className="register-form-input"
          withAsterisk
          label="Password"
          placeholder="password"
          classNames={{ input : 'prim-text-fields'}}
          key={form.key('password')}
          {...form.getInputProps('password')}
        />

        <Group className="register-form-name-row" grow wrap="nowrap" align="flex-start" gap="md">
          <TextInput
            className="register-form-input"
            withAsterisk
            label="First Name"
            placeholder="first name"
            classNames={{ input : 'prim-text-fields'}}
            key={form.key('firstName')}
            style={{ minWidth: 0 }}
            {...form.getInputProps('firstName')}
          />

          <TextInput
            className="register-form-input"
            withAsterisk
            label="Last Name"
            placeholder="last name"
            classNames={{ input : 'prim-text-fields'}}
            key={form.key('lastName')}
            style={{ minWidth: 0 }}
            {...form.getInputProps('lastName')}
          />
        </Group>

        <Stack className="register-form-actions" justify="center" align='center' gap='xs' mt="md">
          <Button variant="primary" type="submit">Register</Button>
          <Button variant="secondary" onClick={handleLoginRedirect}>Back to Login</Button>
        </Stack>
        {submitError ? <p className="auth-form-error">{submitError}</p> : null}
      </form>
    <Background />
    </div>
    </div>
  );
}
