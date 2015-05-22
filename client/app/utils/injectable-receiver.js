export class InjectableReceiver {
  constructor(args) {
    this.services = {};
    this.constructor.$inject.forEach(
      (key, index) => this.services[key] = args[index]
    );
  }
}