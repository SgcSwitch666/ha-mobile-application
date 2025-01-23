import {
  bootstrapApplication,
  provideNativeScriptHttpClient,
  provideNativeScriptNgZone,
  provideNativeScriptRouter,
  runNativeScriptAngularApp,
} from '@nativescript/angular';
import { withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app/app.routes';
import { SensorsComponent } from './app/sensors/sensors.component';

runNativeScriptAngularApp({
  appModuleBootstrap: () => {
    return bootstrapApplication(SensorsComponent, {
      providers: [
        provideNativeScriptHttpClient(withInterceptorsFromDi()),
        provideNativeScriptNgZone(),
        provideNativeScriptRouter(routes),
      ],
    });
  },
});
