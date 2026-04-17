import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  AppShell,
  Burger,
  Code,
  Group,
  Text,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconLayoutDashboard,
  IconMail,
  IconSettings,
  IconGripVertical,
  IconSwitchHorizontal,
  IconLogout,
  IconMoon,
  IconSun,
  IconLogs,
  type TablerIcon,
} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';

type NavItem = {
  link: string;
  label: string;
  icon: TablerIcon;
};

type PostLoginNavigationProps = {
  children: ReactNode;
  links?: NavItem[];
  title?: string;
  version?: string;
  changeAccountPath?: string;
  logoutPath?: string;
  onLogout?: () => void;
};

const defaultLinks: NavItem[] = [
  { link: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  {link: '/logs', label: 'Device Logs', icon: IconLogs},
  { link: '/settings', label: 'Settings', icon: IconSettings },
  { link: '/contact', label: 'Contact', icon: IconMail },
  { link: '/about', label: 'About', icon: IconGripVertical},
];

export default function PostLoginNavigation({
  children,
  links = defaultLinks,
  title = 'S.A.B.R.E.',
  version = 'v1.0.0',
  changeAccountPath = '/login',
  logoutPath = '/home',
  onLogout,
}: PostLoginNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpened, { toggle, close }] = useDisclosure(false);
  const { toggleColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('light', {
    getInitialValueInEffect: true,
  });

  const handleRoute = (path: string) => {
    navigate(path);
    close();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      close();
      return;
    }
    localStorage.removeItem("token");
    navigate(logoutPath);
    close();
  };

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !mobileOpened, desktop: false },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between" >
          <Group gap="sm">
            <Burger opened={mobileOpened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Text fw={900} size="lg" style={{ letterSpacing: '0.1em' }}>
              {title}
            </Text>
          </Group>

          <Group gap="xs">
            <Code fw={700}>{version}</Code>
                <ActionIcon radius='sm' aria-label='toggle' className="navToggle" onClick={() => toggleColorScheme()}>
                    {computedColorScheme === 'light' ? <IconMoon /> : <IconSun /> }
                </ActionIcon>
          </Group>

        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <div className={classes.navbarMain}>
          {links.map((item) => (
            <a
              className={classes.link}
              data-active={location.pathname === item.link || undefined}
              href={item.link}
              key={item.label}
              onClick={(event) => {
                event.preventDefault();
                handleRoute(item.link);
              }}
            >
              <item.icon className={classes.linkIcon} stroke={1.5} />
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div className={classes.footer}>
          <a
            className={classes.link}
            href={changeAccountPath}
            onClick={(event) => {
              event.preventDefault();
              handleRoute(changeAccountPath);
            }}
          >
            <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
            <span>Change account</span>
          </a>

          <a
            className={classes.link}
            href={logoutPath}
            onClick={(event) => {
              event.preventDefault();
              handleLogout();
            }}
          >
            <IconLogout className={classes.linkIcon} stroke={1.5} />
            <span>Logout</span>
          </a>
        </div>
      </AppShell.Navbar>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
