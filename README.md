## Setting up
Project requires: node >= "8.2.1" npm >= "5.3.0", Webpack >= "^4.15.1";
Support Browsers: IE>=11; FireFox >= 60; Chrome >=49; Opera >= 54;

1. open root folder MapViewer project;
2. if required, install missing packages "npm install" on cmd;

[Develop]

- develop mode permit you run 'webpack-dev-server', without 'babel' and respectively IE capability;
- `webpack-dev-server` stored all build files in local hash;

1. run develop server "npm run develop" on cmd;

[Production]

- production mode permit you run 'webpack-dev-server', with the support 'babel'and IE capability;
- you can use production mode to test project prepare build on IE compatibility;
- `webpack-dev-server` stored all build files in local hash;

1. run production server "npm run build" on cmd;

[Build]
1. create build bundle "npm run build" on cmd;
2. folder 'dist' is created automatically in root project folder.

[package.json]
1. Disable auto-update modules '^', get more stability modules.
2. `Last update modules 04.01.2019`

[package-lock.json]
1. If need clean package-lock.json, check carefully modules get latest version. If auto-update module enable '^',
compatibility not guaranteed.

[.version]
Application version file. 
Hint! Don't set revision (4th number) as it will be set automatically to build id.

[Other]
check install packages 'npm-check'
show webpack error: 'webpack --display-error-details'


