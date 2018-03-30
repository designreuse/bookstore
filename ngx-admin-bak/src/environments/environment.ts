/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  INTERFACE_URL: 'http://202.102.101.65:18500',
  mqUrl: 'ws://202.102.101.65:61614',
  gaodeMapUrl : 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
  gaodeYxMapUrl : 'http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  gaodeYxMarkMapUrl : 'http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
  hongxinMapUrl : 'http://202.102.112.19:6080/arcgis/rest/services/mapmercator/MapServer/tile/{z}/{y}/{x}',
};
