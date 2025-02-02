/*
CMD:
NODE_PATH=./_.nosync/node_modules node post-process.js
*/

const chokidar = require('chokidar');
const fs = require("fs");
const path = require("path");

// File path configurations
const WATCH_DIR = './';
const INPUT_FILE_PATTERN = '_.txt';
const CAPCUT_VVT_OUTPUT_FILE_NAME = '_for-capcut-vvt.txt';
const YOUTUBE_SRT_OUTPUT_FILE_NAME = '_for-youtube-srt.txt'; // 新增这一行
const BREAK_WORDS = '"- I know."';

// Watch current directory and all subdirectories for changes
const watcher = chokidar.watch(WATCH_DIR, {
  ignored: (file, _stats) => _stats?.isFile() && !file.endsWith(INPUT_FILE_PATTERN),
  ignoreInitial: false,
  atomic: true,
});

// Watch file changes
watcher
  .on('add', (filePath) => {
    console.log(`File added: ${filePath}`);
  })
  .on('change', (filePath) => {
    console.log(`File changed: ${filePath}`);

    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        console.error("Error reading file:", err);
        return;
      }
  
      // Get the first line of text (after removing empty lines) as the article title
      const lines = data.split(/\n+/).filter(line => line.trim());
      const articleTitle = lines[0] || '';

      // Helper function to transform page turn instruction
      const transformPageTurn = (line, articleTitle) => {
        if (line.match(/^• Please turn to page \d*\s*$/)) {
          const pageNum = line.match(/\d+/)[0];
          return `Please turn to page ${pageNum} and find the article "${articleTitle}".\n\nWill continue playing after the countdown.\n\nTen, Nine, Eight, Seven, Six, Five, Four, Three, Two, One, Zero.`;
        }
        return line;
      };

      // Process the data for CapCut
      const processedDataForCapCut = data
        .split(/\n+/)
        .filter(line => line.trim())
        .map(line => {
          // Like Prompts 2: Enclose all capitalized proper names and phrases
          line = line.replace(/\b([A-Z][A-Z]+\s+)?([A-Z][A-Za-z]+\s+)+[A-Z][A-Za-z]+\b/g, match => {
        return line.includes(`"${match}"`) ? match : `"${match}"`;
          });
          line = line.replace(/\b[A-Z][a-z]{2,}\s+([A-Z][a-z]{2,}\s*)+\b(?![^"]*")/g, match => {
        return line.includes(`"${match}"`) ? match : `"${match}"`;
          });

          return line;
        })
        // Like Prompts 1: Replace '• Please turn to page XX' with countdown text
        .map(line => transformPageTurn(line, articleTitle))
        // .map(line => line.replace(/(?<!")\.(?!")\s*/g, '.\n\n')) // Add two newlines after periods not in quotes
        .map(line => line.replace(/(?<!")\.(?!")\s*/g, '.\n\n')) // Add two newlines after periods not in quotes
        // .map(line => line.replace(/"([^"|\n]*)(?=\n*$)/g, '"$1"')) // Add closing quote if line has an opening quote but no closing quote using regex
        .flatMap(line => line.split('\n'))  // Split multi-line strings into separate lines
        .filter(line => line.trim())  // Remove empty lines
        .map(line => {
          // Add period if line doesn't end with punctuation
          // if (!/[.!?"]$/.test(line.trim())) {
          //   line = line.trim() + '.';
          // }
          if (!/[.]$/.test(line.trim())) {
            line = line.trim() + '.';
          }
          return `${line}\n\n${BREAK_WORDS}\n`;
        })
        .map(line => line.replace(/WA/g, "W.A"))
        .join('\n');

      // Process the data for YouTube
      const processedDataForYoutube = data
        .split(/\n+/)
        .filter(line => line.trim())
        .map(line => transformPageTurn(line, articleTitle))
        // .map(line => line.replace(/(?<!“)\.(?!”)\s*/g, '.\n\n')) // Add two newlines after periods not in quotes
        .map(line => line.replace(/(?<!")\.(?!")\s*/g, '.\n\n')) // Add two newlines after periods not in quotes
        // .map(line => line.replace(/“([^”|\n]*)(?=\n*$)/g, '“$1”')) // Add closing quote if line has an opening quote but no closing quote using regex
        .flatMap(line => line.split('\n'))  // Split multi-line strings into separate lines
        .filter(line => line.trim())  // Remove empty lines
        .join('\n\n');

      const capCutVvtOutputPath = path.join(path.dirname(filePath), CAPCUT_VVT_OUTPUT_FILE_NAME);
      const youtubeSrtOutputPath = path.join(path.dirname(filePath), YOUTUBE_SRT_OUTPUT_FILE_NAME);

      // Write both files
      fs.writeFile(capCutVvtOutputPath, processedDataForCapCut, (err) => {
        if (err) {
          console.error("Error writing CapCut file:", err);
          return;
        }
        console.log(`Processed CapCut file saved as ${capCutVvtOutputPath}`);
      });

      fs.writeFile(youtubeSrtOutputPath, processedDataForYoutube, (err) => {
        if (err) {
          console.error("Error writing YouTube file:", err);
          return;
        }
        console.log(`Processed YouTube file saved as ${youtubeSrtOutputPath}`);
      });
    });
  })
  .on('unlink', (filePath) => {
    console.log(`File removed: ${filePath}`);
    
    // Delete CapCut output file
    const capCutOutputPath = path.join(path.dirname(filePath), CAPCUT_VVT_OUTPUT_FILE_NAME);
    fs.unlink(capCutOutputPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error("Error deleting CapCut output file:", err);
      } else if (!err) {
        console.log(`Deleted CapCut file: ${capCutOutputPath}`);
      }
    });

    // Delete YouTube output file
    const youtubeOutputPath = path.join(path.dirname(filePath), YOUTUBE_SRT_OUTPUT_FILE_NAME);
    fs.unlink(youtubeOutputPath, (err) => {
      if (err && err.code !== 'ENOENT') {
        console.error("Error deleting YouTube output file:", err);
      } else if (!err) {
        console.log(`Deleted YouTube file: ${youtubeOutputPath}`);
      }
    });
  });

watcher.on('error', error => console.log(`Error occurred: ${error}`));

console.log('Watching for file changes in current directory...');
