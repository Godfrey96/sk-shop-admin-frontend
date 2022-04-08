// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiURL: 'https://skshop-backend-api.herokuapp.com/api/v1/',
  firebase: {
    apiKey: "AIzaSyAyw-3wj7zINsoxPJlfvZ0BgpqUz331ht0",
    authDomain: "shop-255c5.firebaseapp.com",
    projectId: "shop-255c5",
    storageBucket: "shop-255c5.appspot.com",
    messagingSenderId: "363100806624",
    appId: "1:363100806624:web:af93b3010c6940e27b1f85"
  },
  ngStripeKey: 'pk_test_51JjjPCF3RlIhoq4AnPOMLWqnPKsvWUNzwULfyIogwiwu7Hcu7IKOyZyUAfHbmyHCvLWrSTBxVNA3g1Hi5q0CmTQN00RC7LcsNj'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
