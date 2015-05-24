import {Inject, getServices} from 'utils/di';

export class MainCtrl {
  services: any;
  user: any;
  userDisplayName: any;
  errorMessage: any;

  constructor(
    @Inject('$log') $log,
    @Inject('users') users,
    @Inject('koast') koast
  ) {
    this.services = getServices(this.constructor, arguments);
    this.user = this.services.koast.user;
    this.services.koast.user.whenAuthenticated()
        .then(() => this.services.users.whenReady())
        .then(function() {
        this.userDisplayName = this.services.users.getUserDisplayName(
            this.services.koast.user.data.username);
        }.bind(this))
        .then(null, this.services.$log.error);
  }

  login(form) {
    this.services.koast.user.loginLocal(form)
      .then(null, this.showLoginError.bind(this));
  }

  logout() {
    this.services.koast.user.logout()
      .then(null, this.services.$log.error);
  }

  showLoginError(errorMessage) {
    this.errorMessage = 'Login failed.';
    this.services.$log.error(errorMessage);
  }
}