import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
  
//Declaring type for Adapter config object that's placed in index.html
//so it can be used later for creating an instance of Adapter
//Makes deploy easier since it can be edited even after the production build
declare global {
    interface Window { sasjsConfigInput: any; }
}