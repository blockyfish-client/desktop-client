const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Deeeep.io-win32-ia32/'),
    authors: 'pi',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'Deeeep.io.exe',
    setupExe: 'Pi-DDC-setup.exe',
    setupIcon: path.join(rootPath, 'img', 'icons', 'win', 'icon.ico'),
    iconUrl: "https://raw.githubusercontent.com/ThePiGuy3141/Deeeep.io-v4-Desktop-Client/master/build/icon.ico",
    loadingGif: path.join(rootPath, 'img', 'loading.gif')
  })
}