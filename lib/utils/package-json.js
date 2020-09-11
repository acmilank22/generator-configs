const latestVersion = require('latest-version');
const ora = require('ora');

function getPackageJSON({ context }) {
  return context.fs.readJSON(context.destinationPath('package.json'));
}

function writePackageJSON({ context, json }) {
  context.fs.writeJSON(context.destinationPath('package.json'), json);
}

function extendPackageJSON({ context, json }) {
  context.fs.extendJSON(context.destinationPath('package.json'), json);
}

async function extendPackages({ context, packageNames, devDependencies }) {
  const key = devDependencies ? 'devDependencies' : 'dependencies';
  const json = {
    [key]: {},
  };
  const promises = packageNames.map(async (packageName) => {
    const version = await latestVersion(packageName);
    json[key][packageName] = `^${version}`;
    return version;
  });
  const spinner = ora();
  spinner.start(`Get npm packages latest version: ${packageNames.join(', ')}`);
  await Promise.all(promises);
  spinner.succeed(
    `Success - Get npm packages latest version: ${packageNames.join(', ')}`
  );
  extendPackageJSON({ context, json });
}

async function extendDevDependencies({ context, packageNames }) {
  await extendPackages({ context, packageNames, devDependencies: true });
}

async function extendDependencies({ context, packageNames }) {
  await extendPackages({ context, packageNames, devDependencies: false });
}

module.exports = {
  getPackageJSON,
  writePackageJSON,
  extendPackageJSON,
  extendPackages,
  extendDevDependencies,
  extendDependencies,
};