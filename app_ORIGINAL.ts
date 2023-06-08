
/* given some input in text file, read the file and gives an aggregation of most commonly used words and least used words

in sorted order by count, using typescript, count the number of occurences, produce a new output from the input, apply ceasor cipher encryption to that doc,

third feature would be given some text translate it into a different language, for all these use typescript */

import * as readline from 'readline';
import * as fs from 'fs-extra';


// return error type/description instead

type left = { type: "LEFT", left: string }
type right = { type: "RIGHT", right: readline.Interface }
type Either = left | right

// type response = [Error, any]
type Response<T> = [Error, null] | [null, T]

const getLineReader = (fileName: string): Response<readline.Interface> => {
    const path: string = `./data/${fileName}`;
    if (!fs.existsSync(path)) {
        // return { type: "LEFT", left: 'file does not exists' }
        return [new Error("file does not exist"), null]
    }
    try {
        const lineReader: readline.Interface = readline.createInterface({
            input: fs.createReadStream(path),
            terminal: false,
        });
        // if (lineReader === "") {
        //     // return { type: "LEFT", left: 'empty linereader' }
        //     return [new Error("empty "), null]
        // }
        // return the linereader interface if it exists for the input file
        // return { type: "RIGHT", right: lineReader };
        return [null, lineReader]
    }
    catch (error) {
        return [error, null]
        // if (typeof error === "string") {
        //     // return { type: "LEFT", left: error }
        // }
        // else if (error instanceof Error) {
        //     return { type: "LEFT", left: error.message }
        // }
        // return { type: "LEFT", left: 'error' }
    }
}

// objecvt signature
const countWords = (fileData: { [key: string]: word }, line: string): { [key: string]: word } => {
    const words: string[] = line.split(" ");
    let newFileData: { [key: string]: word } = { ...fileData };
    words.forEach(w => {
        let currentWord = w.toLowerCase();
        if (currentWord in newFileData) {
            newFileData[currentWord] = { ...newFileData[currentWord], count: newFileData[currentWord].count + 1 };
        }
        else {
            newFileData[currentWord] = { value: currentWord, count: 1 };
            // console.log(fileData)
        }
    });

    return newFileData
}

type word = {
    value: string;
    count: number;
}

const getMostAndLeast = (n: number): void => {
    let wordCount: word[] = [];
    Object.keys(fileData).forEach(key => {
        wordCount.push(fileData[key])
    });

    wordCount.sort(function (a, b) {
        return a.count - b.count;
    });

    console.log(wordCount)

    // return [wordCount.slice]
}

const processFile = (fileName: string): "success" | "failure" => {
    const [error, lineReader] = getLineReader(fileName);

    if (error !== null) {
        return "failure"
    }

    // if (typeof (lineReader) === "string") {
    //     console.log("Error reading the input file!");
    //     return "failure"
    // }
    // else {
    let data = {};
    lineReader.on('line', (line) => {
        data = countWords(data, line);
    });
    // }
    return "success"
}


var result = processFile("input.txt");

if (result === "success") {
    console.log("File processed successfully!")
    getMostAndLeast(10);
}
else {
    console.log("Error processing the file!")
}

