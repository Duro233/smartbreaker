import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconHome,
  IconLayoutDashboard,
  IconMail,
  IconSettings,
  IconSwitchHorizontal,
  IconLogout,
} from '@tabler/icons-react';
import { Code, Group, Text } from '@mantine/core';
import classes from './NavbarSimple.module.css';

const data = [
  { link: '/home', label: 'Home', icon: IconHome },
  { link: '/dashboard', label: 'Dashboard', icon: IconLayoutDashboard },
  { link: '/contact', label: 'Contact', icon: IconMail },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];

export function NavbarSimple() {
  const navigate = useNavigate();
  const location = useLocation();

  const links = data.map((item) => (
    
      className={classes.link}
      data-active={location.pathname === item.link || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        navigate(item.link);
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text fw={900} size="xl" style={{ letterSpacing: '0.1em' }}>
            S.A.B.R.E.
          </Text>
          <Code fw={700}>v1.0.0</Code>
        </Group>
        {links}
      </div>
      <div className={classes.footer}>
        <a className={classes.link} href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>
        <a className={classes.link} href="#" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          <Text fw={900} size="xl" style={{ letterSpacing: '0.1em' }}>
            S.A.B.R.E.
          </Text>
          <Code fw={700}>v1.0.0</Code>
        </Group>
        {links}
      </div>
      <div className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
}
