# keybr-with-stats

In &lt; 1000 lines of code, practice any dictionary and get targeted feedback and statistics per character and pair of characters, like Keybr. Right now, common Rust programming keywords are the dictionary.

Demo here: https://keybr.onrender.com/

<img width="586" alt="image" src="https://github.com/Divide-By-0/keybr-with-stats/assets/4804438/ad518ed6-67ba-4452-b598-ca3fd2df3ec6">

## Compile

```
yarn install
tsc typingAnalysis.ts
```

## Run

Open index.html in browser.

## Info

This code was ~80% written with GPT-4 in Cursor IDE. Here was the initial prompt:

```
generate typescript code for a simple browser website that analyzes your typing. have it display a few sentences at a time that it asks you to type. overlay your typing beneath it, highlighting red characters when you get something wrong, green if its correct, and yellow if you previously got it wrong but then went back and got it correct. if a letter is wrong, do not allow progression of the cursor and force the user to backspace their errors.

display at the bottom the statistics for each lowercase letter, symbol, and capital letter, and highlight it lighter if the accuracy-adjusted WPM is high, and darker if its lower. calculate this average as a time-adjusted weighting of the history where recent updates are more heavily considered.

also show on the side the 10 most missed individual keys and the 10 most missed pairs of keys, including shift and punctuation.

have a nice user interface like keybr.
```

[Linked here is the full transcript](https://chat.openai.com/share/bb9db3f2-25c7-4c96-b1e3-631bbe4494c3) of the discussion, not including the Cursor prompts and manual tweaks.
