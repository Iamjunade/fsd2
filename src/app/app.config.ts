import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  importProvidersFrom
} from '@angular/core';
import {provideRouter} from '@angular/router';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';

import {routes} from './app.routes';

const monacoConfig: NgxMonacoEditorConfig = {
  baseUrl: 'assets/monaco/min/vs',
  defaultOptions: { scrollBeyondLastLine: false },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), 
    provideRouter(routes),
    importProvidersFrom(MonacoEditorModule.forRoot(monacoConfig))
  ],
};
