import '@mantine/core/styles.css';
import {
  AppShell,
  Burger,
  Group,
  Text,
  Anchor,
  Stack,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

export default function Navigation() {
  const [opened, { toggle, close }] = useDisclosure();

  const links = ['Home', 'Dashboard', 'Settings'];

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
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
            <Text fw={700}>SABRE Smart Break</Text>
          </Group>

          {/* Desktop nav links */}
          <Group visibleFrom="sm" gap="lg">
            {links.map((link) => (
              <Anchor key={link} href="#">
                {link}
              </Anchor>
            ))}
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
