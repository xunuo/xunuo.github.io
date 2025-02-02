还未自动化，人肉通过在VSCODE给 Claude 预处理指令，提示词最好单句内提示完：

For VSCode Copilot:
Keep the original content,order and punctuation unchanged, Outputting the smallest segments suitable for reading aloud, Make long sentences semantically separated using comma symbols.

Keep the original content,order and punctuation unchanged, Outputting the segments suitable for reading aloud, Make long sentences semantically separated using comma symbols.


For GPT:
I will provide content, connect sentences inline with the original content, order and punctuation unchanged, Outputting the smallest segments suitable for reading aloud, Make long sentences semantically separated using comma symbols.



// 提取到 POST Process 的
Add '"- I know."' in every line break.
Replace all instances of "WA" with "W.A".
Replace '• Please turn to page XX' with: 'Please turn to page XX and find the article titled "{Insert the first line text}". I will continue after the countdown: Ten, Nine, Eight, Seven, Six, Five, Four, Three, Two, One, Zero.'.
Enclose all capitalized proper names and phrases that clearly need to be read consecutively in double quotation marks.