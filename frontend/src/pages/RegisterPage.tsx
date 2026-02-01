import { registerUser } from '../routes/auth';

import { Button, Stack, TextInput, PasswordInput} from '@mantine/core';
import { useForm } from '@mantine/form';

import Navigation from '../components/navigation';
import Background from '../components/background/Background';

export default function Register() {
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
    try {
      const res = await registerUser(values);
      if(res.status === 201)
      {
        console.log("Registration Success");
        window.location.href = '/home';
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
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
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))} className='form-borders' style={{padding : '65px 45px 50px 45px'}}>
        
        <TextInput
          withAsterisk
          label="First Name"
          placeholder="First Name"
          classNames={{ input : 'prim-text-fields'}}
          key={form.key('firstName')}
          {...form.getInputProps('firstName')}
        />

        <TextInput
          withAsterisk
          label="Last Name"
          placeholder="Last Name"
          classNames={{ input : 'prim-text-fields'}}
          key={form.key('lastName')}
          {...form.getInputProps('lastName')}
        />

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

        <Stack justify="center" align='center' gap='xs' mt="md">
          <Button variant="primary" type="submit">Register</Button>
          <Button variant="secondary" onClick={handleLoginRedirect}>Back to Login</Button>
        </Stack>
      </form>
    <Background />
    </div>
    </div>
  );
}
