export class CookieJar {
  constructor() {
    this.data = {};
  }

  getItem(key) {
    return this.data[key];
  }

  setItem(key, value) {
    this.data[key] = value;
  }
}

export class NotificationsManager {
  constructor({ notificationData = [], cookieJar = null }) {
    this.update(notificationData);
    this.cookieJar = cookieJar ? cookieJar : new CookieJar();
  }

  update(notificationData) {
    this.notificationData = notificationData.filter((item) => item.slot != 'survey');
    this.surveyData = notificationData.filter((item) => item.slot == 'survey');
  }

  hasNotifications() {
    return this.notificationData.length > 0;
  }

  hasSurveys() {
    return this.surveyData.length > 0;
  }

  count() {
    return this.notificationData.length;
  }

  hasNewNotifications() {
    return this.timestamp() != this.effectiveOn();
  }

  effectiveOn() {
    if (this.hasNotifications()) {
      return this.notificationData[0].effective_on;
    }
    return '9999-99-99 23:59:59';
  }

  timestamp() {
    return this.cookieJar.getItem('HT.notice') || '';
  }

  updateTimestamp() {
    this.cookieJar.setItem('HT.notice', this.effectiveOn(), 90);
  }
}

export default NotificationsManager;
