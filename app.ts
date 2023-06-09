
/* given some input in text file, read the file and gives an aggregation of most commonly used words and least used words

in sorted order by count, using typescript, count the number of occurences, produce a new output from the input, apply ceasor cipher encryption to that doc,

third feature would be given some text translate it into a different language, for all these use typescript */

import * as readline from 'readline';
import * as fs from 'fs-extra';


type Response<T> = [Error, null] | [null, T];
type word = { value: string, count: number };
type wordDictObject = { [key: string]: word };

type encryptionKey = number & { __brand: 'encryptionKey' };

// user defined type guard
function isValidKey(value: unknown): value is encryptionKey {
    if (typeof value === 'number' && value >= 1 && value <= 25) {
        return true
    }
    return false
}


function getLineReader(filePath: string): Response<readline.Interface> {
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

function isValidUrl(urlString: string): boolean {
    try {
        let url = new URL(urlString);
    }
    catch (_) {
        return false;
    }

    return true
}


// object signature
// remove stop words as well, probably need to use the nltk package
function countWords(fileData: wordDictObject, line: string): wordDictObject {
    const stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now']
    const words: string[] = line.split(" ");
    // let's load english stopwords

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
        if (stopwords.includes(currentWord)) {
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


function getMostAndLeast(data: wordDictObject, n: number): word[][] {
    let wordCount: word[] = [];
    Object.keys(data).forEach(key => {
        wordCount.push(data[key])
    });

    wordCount.sort(function (a, b) {
        return b.count - a.count;
    });
    return [wordCount.slice(0, n), wordCount.slice(wordCount.length - n, wordCount.length)]
}


function encryptor(char: string, key: number): string {
    const charCode = char.charCodeAt(0);
    // A = 65, Z = 90
    // a = 97, z = 122
    return String.fromCharCode(
        ((charCode + key) <= 122) ? charCode + key
            : (charCode + key) % 122 + 96
    );
}

function encryptText(text: string, key: encryptionKey): Response<string> {
    try {
        // console.log("Key for encryption : ", key)
        text = text.toLowerCase();
        const encryptedText = text.replace(/[a-z]/g, (x) => encryptor(x, key));
        if (encryptedText === null || encryptedText === "") {
            return [new Error("Empty file!"), null]
        }
        return [null, encryptedText]
    }
    catch (error) {
        return [error, null]
    }
}


async function processFile(fileName: string): Promise<Response<wordDictObject>> {
    const [error, lineReader] = getLineReader(fileName);
    if (error !== null) {
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




// function encryptAndWrite(err: any, fileText: string): void {
//     if (err) {
//         console.log(err);
//         return;
//     }
//     const [error, encryptedText] = encryptText(fileText, this.key);
//     if (error !== null) {
//         console.log(error);
//         return;
//     }
//     fs.writeFile(this.outputFile, encryptedText, logErrors)
//     console.log("File encrypted/decrypted successfully at - ", this.outputFile)
// }

function encryptAndWrite(fileName: string, key: encryptionKey, outputFile: string): void {
    const [err1, fileText] = readFile(fileName)
    if (err1 !== null) {
        console.log(err1);
        return;
    }
    const [err2, encryptedText] = encryptText(fileText, key);
    if (err2 !== null) {
        console.log(err2);
        return;
    }
    const [err3, outFile] = writeFile(outputFile, encryptedText)
    if (err3 !== null) {
        console.log(err3);
        return;
    }
    console.log("File encrypted/decrypted successfully at - ", outputFile)
}

function readFile(fileName: string): Response<string> {
    try {
        const fileText: string = fs.readFileSync(fileName,
            { encoding: 'utf8', flag: 'r' });
        return [null, fileText];
    }
    catch (e) {
        return [e, null];
    }
}

function writeFile(fileName: string, data: string): Response<string> {
    try {
        fs.writeFileSync(fileName, data)
        return [null, fileName];
    }
    catch (e) {
        return [e, null];
    }
}

function logErrors(err: unknown): void {
    // In case of a error throw err.
    if (err) console.log(err);
}

async function translateText(text: string[], target: string): Promise<Response<string[]>> {
    try {
        let translations: string[][] = await translate.translate(text, target);
        return [null, translations[0]]
    }
    catch (error) {
        return [error, null]
    }
}

function saveTranslation(response: Response<string[]>, file: string): Response<string> {
    const [error1, translatedText] = response;
    if (error1 !== null) {
        return [error1, null];
    }
    const [error2, outFile] = writeFile(file, translatedText[0]);
    if (error2 !== null) {
        return [error2, null];
    }
    return [null, outFile]
}

function translateAndSave(fileName: string, targetLanguageCode: string): void {
    const [readError, fileData] = readFile(FILE);
    if (readError !== null) {
        console.log(readError);
        return;
    }

    const promise = translateText([fileData], targetLanguageCode);
    promise.then((res) => {
        const [saveErr, savedFile] = saveTranslation(res, TRANSLATED_FILE);
        if (saveErr !== null) {
            console.log(saveErr)
            return;
        }
        console.log(`Translated file saved at ${savedFile}`)
        return;
    })
    console.log("Error performing translation or writing." )
    return;
}



// MAIN

const FILE: string = "./data/input.txt"

const ENCRYPTED_FILE: string = "./data/encrypted.txt"

const DECRYPTED_FILE: string = "./data/decrypted.txt"

const TRANSLATED_FILE: string = "./data/translated.txt"

const promise = processFile(FILE);

const cipherKey: number = 12;

promise.then(([error, data]) => {
    if (error !== null) {
        console.log(error);
    }
    else {
        let numWords = 10;
        const results: word[][] = getMostAndLeast(data, numWords);
        console.log("Most commonly used words : ", results[0]);
        console.log("Least commonly used words : ", results[1]);
    }
})


// ENCRYPTION
// is bind the smarter way to do this? since fs.readline only passes 2 arguments to the callback function
// if (fs.existsSync(FILE) && isValidKey(cipherKey)) {
//     fs.readFile(FILE, 'utf8', encryptAndWrite.bind({ key: cipherKey, outputFile: ENCRYPTED_FILE }));
// }

if (fs.existsSync(FILE) && isValidKey(cipherKey)) {
    encryptAndWrite(FILE, cipherKey, ENCRYPTED_FILE)
}

const decryptionKey = 26 - cipherKey;
if (fs.existsSync(ENCRYPTED_FILE) && isValidKey(decryptionKey)) {
    encryptAndWrite(ENCRYPTED_FILE, decryptionKey, DECRYPTED_FILE)
}


// Imports the Google Cloud client library
const { Translate } = require('@google-cloud/translate').v2;

const GOOGLE_APPLICATION_CREDENTIALS: string = "./credentials/credentials.json"

// Creates a client
const translate = new Translate({
    projectId: 'chrome-flight-389215',
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS
});




// translate the input file instead of the string
const textData: string[] = ["what are you dong?", "hi how are you"];
const targetLanguageCode: string = "es";

// TRANSLATE AND SAVE THE FILE
translateAndSave(FILE, targetLanguageCode);

// const translatePromise = translateText(textData, targetLanguageCode);
// translatePromise.then(displayTranslations)


// function displayTranslations([error, translations]: Response<string[]>) {
//     if (error !== null) {
//         console.log(error);
//         return;
//     }
//     translations.forEach(displayTranslation);

// }

// function displayTranslation(translation: string, i: number) {
//     console.log(`[${i + 1}]`)
//     console.log("Original => ", textData[i]);
//     console.log("Translated => ", translation);
// }




exports.isValidUrl = isValidUrl;