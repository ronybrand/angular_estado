// jsdom (v30.0.1 here) doesn't implement <dialog>'s imperative API
// (showModal/close) - a long-standing, still-unresolved gap in jsdom. This
// polyfill only kicks in when the API is missing, so it's a no-op in a real
// browser - lets components use the native <dialog> element (ex:
// ConfirmDialogComponent) without pulling in a modal library just to
// sidestep a test-environment limitation.
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement): void {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement): void {
    this.removeAttribute('open');
  };
}
