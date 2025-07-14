import NotificationsModal from './index.svelte';
import PingCallbackDecorator from '../../decorators/PingCallbackDecorator';
import { userEvent, within, waitFor } from "@storybook/test";
import { action } from '@storybook/addon-actions';

import { expect } from "@storybook/test";

import { TestCookieJar } from '../../lib/cookies';
import NotificationsManager from '../../lib/notifications';

let sampleData = [
  {
    message: "It really isn't too early to think about your season tickets to the Big House.",
    read_more_label: 'Would you like to know more?',
    read_more_link: 'https://mgoblue.com/sports/2021/1/29/football-season-tickets.aspx',
    title: 'GO BLUE!',
    effective_on: '2022-08-01 09:00:00',
  },
  {
    message:
      '<p>As a result of changes to Moosylvania State login, you may have lost access to personal collections you had built previously.</p>',
    read_more_label: 'Would you like to know more?',
    read_more_link: 'https://state.moosylvania/login',
    title: 'Moosylvania State change in login',
    effective_on: '2022-08-01 09:00:00',
  },
];

export const actionsData = {
  show: action('show'),
  hide: action('hide'),
};

export default {
  title: 'Notifications Modal',
  component: NotificationsModal,
  decorators: [
    () => ({
      Component: PingCallbackDecorator,
      props: { loggedIn: false, notificationData: null },
    }),
  ],
  excludeStories: /.*Data$/,
  argTypes: {
    show: { action: 'show' },
    hide: { action: 'hide' },
  },
};

let emptyManager = new NotificationsManager({
  cookieJar: new TestCookieJar(),
});
export const NoNotificationsSoTadaNothing = {
  args: {
    manager: emptyManager,
  },
};

let newNotificationData = structuredClone(sampleData);
// optimistically future enough
newNotificationData[0].effective_on = '2025-12-31 23:59:59';
let newCookieJar = new TestCookieJar();
let newManager = new NotificationsManager({
  cookieJar: newCookieJar,
  notificationData: newNotificationData,
});
export const HasNewNotifications = {
  args: {
    manager: newManager,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    let closeButton;
    await waitFor(() => {
      expect(canvas.getByText('Your notifications')).toBeInTheDocument();
    });
    closeButton = canvas.getByRole('button', {name: 'Close modal'});
    await userEvent.click(closeButton);
    expect(newCookieJar.getItem('HT.notice')).toBe(newNotificationData[0].effective_on);
  },
};

let previouslySeenNotificationData = structuredClone(sampleData);
let previouslySeenCookieJar = new TestCookieJar();
previouslySeenCookieJar.setItem('HT.notice', previouslySeenNotificationData[0].effective_on);
let previouslySeenManager = new NotificationsManager({
  cookieJar: previouslySeenCookieJar,
  notificationData: previouslySeenNotificationData,
});
export const PreviouslySeenNotifications = {
  args: {
    isOpen: false,
    manager: previouslySeenManager,
  },
  play: async ({ canvasElement }) => {
    const dialogEl = canvasElement.querySelector('dialog');
    expect(dialogEl.open).toBeFalsy();
  },
};
