// NODE_PATH=./_.nosync/node_modules node watch-and-process.js

const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

const watchDir = path.resolve(__dirname, "./"); // 替换为你的文件夹路径

// 监听指定文件夹内所有名为 srt.txt 的文件
chokidar.watch(path.join(watchDir, "srt.txt")).on("change", (filePath) => {
  console.log(`Detected change in ${filePath}`);

  // 读取文件内容
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // 将每一行内容添加 "- I know."
    const processedData = data
      .split("\n")
      .map((line) => `${line} - I know.`)
      .join("\n");

    // 生成新的文件名 (同目录下的 voice.txt)
    const outputFilePath = path.join(path.dirname(filePath), "voice.txt");

    // 保存处理后的内容到 voice.txt
    fs.writeFile(outputFilePath, processedData, (err) => {
      if (err) {
        console.error("Error writing file:", err);
        return;
      }
      console.log(`Processed file saved as ${outputFilePath}`);
    });
  });
});

console.log(`Watching for changes in ${watchDir}...`);