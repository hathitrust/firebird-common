export class Live {
  constructor(debugEnabled = false) {
    this.debugEnabled = debugEnabled;
    this.lastMessage = '';
    this.lastMessageTimer = null;
  }

  update(message) {
    let div = this.getRegion();
    console.log('-- live.update', div, message);
    if (!div) {
      return;
    }
    div.innerText = message;

    if (this.debugEnabled) {
      if (!this._debugEl) {
        this._debugEl = document.createElement('div');
        this._debugEl.classList.add('toast-container', 'position-fixed', 'bottom-0', 'start-0', 'p-3');
        this._debugEl.innerHTML = `
          <div id="liveDebugToast" class="toast text-bg-dark" role="alert">
            <div class="toast-header">
              <strong class="me-auto">Announce</strong>
              <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
            <div class="toast-body">
              ..
            </div>
          </div>        
        `;
        this._debugEl = document.body.appendChild(this._debugEl);
      }
      this._debugEl.querySelector('.toast-body').innerText = message;
      this._debugEl.querySelector('.toast').classList.toggle('show', message != '');
      console.log('-- live.announce.debug', message, message != '');
    }
  }

  mode(setting) {
    let div = this.getRegion();
    if (!div) {
      return;
    }
    div.setAttribute('aria-live', setting);
  }

  post(message) {
    if (message == '--') {
      this.lastMessage = message;
      return;
    }
    if (this.lastMessage != message) {
      if (this.lastMessageTimer) {
        clearTimeout(this.lastMessageTimer);
        this.lastMessageTimer = null;
      }
      const clearDelay = this.debugEnabled ? 2000 : 500;
      setTimeout(() => {
        this.update(message);
        this.lastMessage = message;
      }, 50);
      this.lastMessageTimer = setTimeout(() => {
        this.update('');
      }, clearDelay);
    }
  }

  announce(message) {
    this.mode('polite');
    this.post(message);
  }

  assert(message) {
    this.mode('assertive');
    this.post(message);
  }

  getRegion() {
    // check for open dialogs
    let container = document.querySelector('dialog[open]') || document.querySelector('#root');
    return container.querySelector('div[aria-live]');
  }
}
