const fs = require('fs');
const { execSync } = require('child_process');

const extractUpdates = (markdown) => {
  const pattern = /## (\d+\.\d+\.\d+)\n((?:\d+\..+\n)+)/g;
  const updates = [];

  let match;
  while ((match = pattern.exec(markdown)) !== null) {
    const version = match[1];
    const updatesStr = match[2];
    const updateArr = updatesStr.trim().split('\n').map(update => update.substr(2));
    updates.push({ version, updates: updateArr });
  }

  return updates;
}


// 获取package.json中的版本号
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version;

// 拼接目标目录路径
const targetDirectory = `./pack/${version}/`;

// 创建目标目录
if (!fs.existsSync(targetDirectory)) {
  fs.mkdirSync(targetDirectory, { recursive: true });
}
// 使用vsce打包插件
execSync(`cross-env NODE_ENV=${process.env.NODE_ENV} npx vsce package --out ${targetDirectory}`, { stdio: 'inherit' });

const uploadContent = fs.readFileSync('UPLOAD.md', 'utf-8');
const updates = extractUpdates(uploadContent);
// 版本更新信息
const versionJsonData = {
  name: packageJson.name,
  version: packageJson.version,
  content: JSON.stringify(updates.find(itme=>itme.version === packageJson.version))
};

// 将 JSON 数据写入到文件
fs.writeFileSync(`${targetDirectory}/upload.json`, JSON.stringify(versionJsonData));

// 最新版本信息
const jsonRes = {
  status_code: 0,
  status_msg: "",
  data: versionJsonData
}
// 将 JSON 数据写入到文件
fs.writeFileSync('./pack/upload.json', JSON.stringify(jsonRes));