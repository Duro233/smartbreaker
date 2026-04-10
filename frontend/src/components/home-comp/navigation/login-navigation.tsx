import '@mantine/core/styles.css';
import {
  AppShell,
  Burger,
  Group,
  Text,
  Anchor,
  Stack,
  ActionIcon,
  useMantineColorScheme,
  useComputedColorScheme,
  useSafeMantineTheme,
  MantineProvider
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Icon123, IconAdjustments, IconMoon, IconSun, IconHome, IconLayoutDashboard, IconMail, IconSettings, IconSwitchHorizontal, IconLogout} from '@tabler/icons-react';
import { useState } from 'react';

export default function Navigation() {
  const [opened, { toggle, close }] = useDisclosure();
  //const [toggleNight, setToggleNight] = useState(true);
  const { setColorScheme, toggleColorScheme } = useMantineColorScheme();
  const computed = useComputedColorScheme('light', {getInitialValueInEffect : true})
  const links = [
    'Home', 'Login', 'Register']; // placeholder for now

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 280,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: true},
      }}
      padding="md"
    >
      {/* HEADER */}
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          {/* Left side */}
          <Group gap='sm'>
            <Burger
              opened={opened}
              onClick={toggle}
              className="hamburger"
              hiddenFrom="sm"
              size="md"
            />
            <Text fw={900} size='lg' style={{letterSpacing: '0.1em'}}>S.A.B.R.E.</Text>
          </Group>

        <Group>
          {/* Desktop nav links */}
          <Group visibleFrom="sm" gap="xs">
            {links.map((link) => (
              <Anchor key={link} href="#">
                {link}
              </Anchor>
            ))}
          </Group>
          
          <Group>
            <Anchor>
                <ActionIcon radius='sm' aria-label='toggle' className="navToggle" onClick={() => toggleColorScheme()}>
                    {computed === 'light' ? <IconMoon /> : <IconSun /> }
                </ActionIcon>
            </Anchor>
          </Group>
        </Group>
            

        </Group>
      </AppShell.Header>

      {/* MOBILE NAVBAR */}
      <AppShell.Navbar p="md">
        <Stack>
          {links.map((link) => (
            <Anchor key={link} href="#" onClick={close}>
              {link}
            </Anchor>
          ))}
        </Stack>
      </AppShell.Navbar>

    </AppShell>
  );
}
