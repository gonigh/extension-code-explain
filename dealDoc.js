const fs = require('fs');
const path = require('path');

// 定义存储插件信息的缓存数组
let cache = [];

// 获取插件文件夹路径
const pluginsFolderPath = path.join(__dirname, './src/plugins');

// 遍历plugins文件夹下的子文件夹
fs.readdir(pluginsFolderPath, (err, folders) => {
  if (err) {
    console.error('读取plugins文件夹时出错：', err);
    return;
  }

  // 遍历每个子文件夹
  folders.forEach((folder) => {
    const folderPath = path.join(pluginsFolderPath, folder);

    // 检查子文件夹是否存在package.json文件
    const packageJsonPath = path.join(folderPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      // 读取package.json文件
      const packageJsonData = fs.readFileSync(packageJsonPath, 'utf8');
      const packageJson = JSON.parse(packageJsonData);

      // 获取name字段和文件夹名称，并保存在cache数组中
      const { name, id, module } = packageJson;
      cache.push({ name, id, type: 'webview', module });
    }
  });

  // 读取根目录下的package.json文件
  const rootPackageJsonPath = path.join(__dirname, 'package.json');
  fs.readFile(rootPackageJsonPath, 'utf8', (err, data) => {
    if (err) {
      console.error('读取根目录下的package.json文件时出错：', err);
      return;
    }

    // 解析JSON数据
    let rootPackageJson = JSON.parse(data);

    // 修改contributes.views.sidebar_test为cache数组
    rootPackageJson.contributes.views.sidebar_test = cache;

    // 将修改后的数据转换回JSON字符串
    let updatedPackageJson = JSON.stringify(rootPackageJson, null, 2);

    // 重新写入package.json文件
    fs.writeFile(rootPackageJsonPath, updatedPackageJson, 'utf8', (err) => {
      if (err) {
        console.error('写入根目录下的package.json文件时出错：', err);
        return;
      }
      console.log('package.json文件已成功更新。');
    });
  });
});
