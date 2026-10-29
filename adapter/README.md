# Pell application adapter

Upstream: `jaredreich/pell`, MIT, commit `d5556baa2e0bfc1411621ee4d780752200b367fd` (package version 1.0.6). This branch leaves upstream `src/` and `dist/` unchanged and adds a standalone adapter. It does not install the upstream legacy Gulp/Babel/Sass toolchain.

Load `dist/pell.js`, then `adapter/pell-adapter.js`. Call `PellAdapter.create({element, actions, label, sanitize, onChange})`. `sanitize` is a required application callback; the adapter does not provide a security sanitizer. Methods: `getHTML()`, `setHTML(html)`, `focus()`, `destroy()`; `content` exposes the editable element. Mount into an empty container and destroy on unmount.

Changes provided by the wrapper: paragraph blocks, textbox semantics and translated labels supplied by the caller, pressed state, selection preservation for toolbar actions, plain-text paste, blocked drops, abortable listeners, observer cleanup. CSS and server persistence belong to the host application.

This is a DOM editor for web applications. It does not run directly in native Flutter widgets. The host must supply its web platform-view integration, authorization, server sanitization, version conflict handling and a safe read-only renderer. Pell uses deprecated `document.execCommand`; browser verification remains necessary.

No product source, customer data, credentials or screenshots are included in this public fork. The integration handoff stays in the private product repository.
