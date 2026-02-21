import { useState } from 'react';
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
  const [active, setActive] = useState('Dashboard');

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
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
