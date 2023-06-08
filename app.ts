
/* given some input in text file, read the file and gives an aggregation of most commonly used words and least used words

in sorted order by count, using typescript, count the number of occurences, produce a new output from the input, apply ceasor cipher encryption to that doc,

third feature would be given some text translate it into a different language, for all these use typescript */

import * as readline from 'readline';
import * as fs from 'fs-extra';


type Response<T> = [Error, null] | [null, T];
type word = { value: string, count: number };
type wordDictObject = { [key: string]: word };

const getLineReader = (filePath: string): Response<readline.Interface> => {
    if (!fs.existsSync(filePath)) {
        return [new Error("file does not exist"), null]
    }
    try {
        const lineReader: readline.Interface = readline.createInterface({
            input: fs.createReadStream(filePath),
            terminal: false,
        });
        return [null, lineReader]
    }
    catch (error) {
        return [error, null]
    }
}

const isValidUrl = (urlString: string): boolean => {
    try {
        let url = new URL(urlString);
    }
    catch (_) {
        return false;
    }

    return true
}


// object signature
const countWords = (fileData: wordDictObject, line: string): wordDictObject => {
    const words: string[] = line.split(" ");
    let newFileData: wordDictObject = { ...fileData };
    words.forEach(w => {
        let currentWord = w.toLowerCase().trim();
        if (isValidUrl(currentWord)) {
            return;
        }
        // remove everything except letters
        currentWord = currentWord.replace(/[^a-z]/g, '');
        if (currentWord === "") {
            return;
        }
        if (currentWord in newFileData) {
            newFileData[currentWord] = { ...newFileData[currentWord], count: newFileData[currentWord].count + 1 };
        }
        else {
            newFileData[currentWord] = { value: currentWord, count: 1 };
        }
    });

    return newFileData
}


const getMostAndLeast = (data: wordDictObject, n: number): word[][] => {
    // console.log(data)
    let wordCount: word[] = [];
    Object.keys(data).forEach(key => {
        wordCount.push(data[key])
    });

    wordCount.sort(function (a, b) {
        return b.count - a.count;
    });
    // console.log(wordCount.slice(0, 10), wordCount.slice(wordCount.length - 10, wordCount.length))
    return [wordCount.slice(0, n), wordCount.slice(wordCount.length - n, wordCount.length)]
}


const encryptor = (char: string, cipher: number): string => {
    const charCode = char.charCodeAt(0);
    // A = 65, Z = 90
    // a = 97, z = 122
    return String.fromCharCode(
        ((charCode + cipher) <= 122) ? charCode + cipher
            : (charCode + cipher) % 122 + 96
    );
}

const encryptText = (text: string): Response<string> => {
    try {
        const cipher: number = Math.floor(1 + Math.random() * 17);
        console.log("Offset for encryption : ", cipher)
        text = text.toLowerCase();
        const encryptedText = text.replace(/[a-z]/g, (x) => encryptor(x, cipher));
        if (encryptedText === null || encryptedText === null) {
            return [new Error("Empty file!"), null]
        }
        return [null, encryptedText]
    }
    catch (error) {
        return [error, null]
    }
}

// create a decryptor and accept cipher as input


async function processFile(fileName: string): Promise<Response<wordDictObject>> {
    const [error, lineReader] = getLineReader(fileName);
    if (error !== null) {
        // return new Promise((resolve) => {
        //     resolve();
        // });
        return [error, null]
    }
    let data: wordDictObject = {};

    // what about the case when linereader fails for some reason? for example only partial data was read and the file/stream closed unexpectedly
    return new Promise(resolve => {
        lineReader
            .on('line', (line) => {
                data = { ...countWords({ ...data }, line) };
            })
            .on('close', function () {
                if (Object.keys(data).length === 0) {
                    return [new Error("No data found!"), null]
                }
                resolve([null, data])
            })
    });
}

const FILE = "./data/input.txt"

const OUTPUTFILE = "./data/output.txt"

const promise = processFile(FILE);

promise.then(([error, data]) => {
    if (error !== null) {
        console.log(error);
    }
    else {
        let numWords = 10
        // console.log(Object.keys(data).length);
        const results: word[][] = getMostAndLeast(data, numWords);
        console.log("Most commonly used words : ", results[0])
        console.log("Least commonly used words : ", results[1])
    }
})


function encryptAndWrite(err: any, fileText: string): void {
    if (err) {
        return;
    }

    const [error, encryptedText] = encryptText(fileText);
    if (error !== null) {
        return;

    }
    fs.writeFile(OUTPUTFILE, encryptedText, logErrors)
    console.log("File encrypted successfully at - ", OUTPUTFILE)
}

function logErrors(err: unknown): void {
    // In case of a error throw err.
    if (err) console.log(err);
}

// ENCRYPTION
if (fs.existsSync(FILE)) {
    fs.readFile(FILE, 'utf8', encryptAndWrite);
}


// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

const GOOGLE_APPLICATION_CREDENTIALS = "./credentials/credentials.json"

// Creates a client
const translate = new Translate({
    projectId: 'chrome-flight-389215',
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS
});

async function translateText(text: string[], target: string): Promise<Response<string[]>> {
    try {
        let translations: string[][] = await translate.translate(text, target);

        // return new Promise((resolve) => {
        //     resolve();
        // });
        return [null, translations[0]]
    }
    catch (error) {
        // return new Promise((resolve) => {
        //     resolve([error, null]);
        // });

        return [error, null]
    }
}


// translate the input file instead of the stribng
const textData: string[] = ["what are you dong?", "hi how are you"];
const targetLanguageCode: string = "es";

const translatePromise = translateText(textData, targetLanguageCode);
translatePromise.then(displayTranslations)


function displayTranslations([error, translations]: Response<string[]>) {
    if (error !== null) {
        console.log(error);
        return;
    }
    translations.forEach(displayTranslation);

}

function displayTranslation(translation: string, i: number) {
    console.log(`[${i + 1}]`)
    console.log("Original => ", textData[i]);
    console.log("Translated => ", translation);
}