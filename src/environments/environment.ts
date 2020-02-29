// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  // URLS BACKENDS
  backendUrl: 'http://vulcano.pais.gob.pe:8070',
  backendUrlPref: 'http://vulcano.pais.gob.pe:8077',
  backendUrlProj: 'http://vulcano.pais.gob.pe:8078',
  backendUA: 'http:///localhost:8072',
  backendUAJ: 'http://localhost:8071',
//  backendUAH : 'http://localhost:8082',

  serverWebSocket: 'http://localhost:3000',
  basicAuthorization: 'angularapp:12345',

  cantCharacters: 3
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.