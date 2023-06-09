"use strict";
/* given some input in text file, read the file and gives an aggregation of most commonly used words and least used words

in sorted order by count, using typescript, count the number of occurences, produce a new output from the input, apply ceasor cipher encryption to that doc,

third feature would be given some text translate it into a different language, for all these use typescript */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
var fs = require("fs-extra");
// user defined type guard
function isValidKey(value) {
    if (typeof value === 'number' && value >= 1 && value <= 25) {
        return true;
    }
    return false;
}
function getLineReader(filePath) {
    if (!fs.existsSync(filePath)) {
        return [new Error("file does not exist"), null];
    }
    try {
        var lineReader = readline.createInterface({
            input: fs.createReadStream(filePath),
            terminal: false,
        });
        return [null, lineReader];
    }
    catch (error) {
        return [error, null];
    }
}
function isValidUrl(urlString) {
    try {
        var url = new URL(urlString);
    }
    catch (_) {
        return false;
    }
    return true;
}
// object signature
// remove stop words as well, probably need to use the nltk package
function countWords(fileData, line) {
    var stopwords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
    var words = line.split(" ");
    // let's load english stopwords
    var newFileData = __assign({}, fileData);
    words.forEach(function (w) {
        var currentWord = w.toLowerCase().trim();
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
            newFileData[currentWord] = __assign(__assign({}, newFileData[currentWord]), { count: newFileData[currentWord].count + 1 });
        }
        else {
            newFileData[currentWord] = { value: currentWord, count: 1 };
        }
    });
    return newFileData;
}
function getMostAndLeast(data, n) {
    var wordCount = [];
    Object.keys(data).forEach(function (key) {
        wordCount.push(data[key]);
    });
    wordCount.sort(function (a, b) {
        return b.count - a.count;
    });
    return [wordCount.slice(0, n), wordCount.slice(wordCount.length - n, wordCount.length)];
}
function encryptor(char, key) {
    var charCode = char.charCodeAt(0);
    // A = 65, Z = 90
    // a = 97, z = 122
    return String.fromCharCode(((charCode + key) <= 122) ? charCode + key
        : (charCode + key) % 122 + 96);
}
function encryptText(text, key) {
    try {
        // console.log("Key for encryption : ", key)
        text = text.toLowerCase();
        var encryptedText = text.replace(/[a-z]/g, function (x) { return encryptor(x, key); });
        if (encryptedText === null || encryptedText === "") {
            return [new Error("Empty file!"), null];
        }
        return [null, encryptedText];
    }
    catch (error) {
        return [error, null];
    }
}
function processFile(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, error, lineReader, data;
        return __generator(this, function (_b) {
            _a = getLineReader(fileName), error = _a[0], lineReader = _a[1];
            if (error !== null) {
                return [2 /*return*/, [error, null]];
            }
            data = {};
            // what about the case when linereader fails for some reason? for example only partial data was read and the file/stream closed unexpectedly
            return [2 /*return*/, new Promise(function (resolve) {
                    lineReader
                        .on('line', function (line) {
                        data = __assign({}, countWords(__assign({}, data), line));
                    })
                        .on('close', function () {
                        if (Object.keys(data).length === 0) {
                            return [new Error("No data found!"), null];
                        }
                        resolve([null, data]);
                    });
                })];
        });
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
function encryptAndWrite(fileName, key, outputFile) {
    var _a = readFile(fileName), err1 = _a[0], fileText = _a[1];
    if (err1 !== null) {
        console.log(err1);
        return;
    }
    var _b = encryptText(fileText, key), err2 = _b[0], encryptedText = _b[1];
    if (err2 !== null) {
        console.log(err2);
        return;
    }
    var _c = writeFile(outputFile, encryptedText), err3 = _c[0], outFile = _c[1];
    if (err3 !== null) {
        console.log(err3);
        return;
    }
    console.log("File encrypted/decrypted successfully at - ", outputFile);
}
function readFile(fileName) {
    try {
        var fileText = fs.readFileSync(fileName, { encoding: 'utf8', flag: 'r' });
        return [null, fileText];
    }
    catch (e) {
        return [e, null];
    }
}
function writeFile(fileName, data) {
    try {
        fs.writeFileSync(fileName, data);
        return [null, fileName];
    }
    catch (e) {
        return [e, null];
    }
}
function logErrors(err) {
    // In case of a error throw err.
    if (err)
        console.log(err);
}
function translateText(text, target) {
    return __awaiter(this, void 0, void 0, function () {
        var translations, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, translate.translate(text, target)];
                case 1:
                    translations = _a.sent();
                    return [2 /*return*/, [null, translations[0]]];
                case 2:
                    error_1 = _a.sent();
                    return [2 /*return*/, [error_1, null]];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function saveTranslation(response, file) {
    var error1 = response[0], translatedText = response[1];
    if (error1 !== null) {
        return [error1, null];
    }
    var _a = writeFile(file, translatedText[0]), error2 = _a[0], outFile = _a[1];
    if (error2 !== null) {
        return [error2, null];
    }
    return [null, outFile];
}
function translateAndSave(fileName, targetLanguageCode) {
    var _a = readFile(FILE), readError = _a[0], fileData = _a[1];
    if (readError !== null) {
        console.log(readError);
        return;
    }
    var promise = translateText([fileData], targetLanguageCode);
    promise.then(function (res) {
        var _a = saveTranslation(res, TRANSLATED_FILE), saveErr = _a[0], savedFile = _a[1];
        if (saveErr !== null) {
            console.log(saveErr);
            return;
        }
        console.log("Translated file saved at ".concat(savedFile));
        return;
    });
    console.log("Error performing translation or writing.");
    return;
}
// MAIN
var FILE = "./data/input.txt";
var ENCRYPTED_FILE = "./data/encrypted.txt";
var DECRYPTED_FILE = "./data/decrypted.txt";
var TRANSLATED_FILE = "./data/translated.txt";
var promise = processFile(FILE);
var cipherKey = 12;
promise.then(function (_a) {
    var error = _a[0], data = _a[1];
    if (error !== null) {
        console.log(error);
    }
    else {
        var numWords = 10;
        var results = getMostAndLeast(data, numWords);
        console.log("Most commonly used words : ", results[0]);
        console.log("Least commonly used words : ", results[1]);
    }
});
// ENCRYPTION
// is bind the smarter way to do this? since fs.readline only passes 2 arguments to the callback function
// if (fs.existsSync(FILE) && isValidKey(cipherKey)) {
//     fs.readFile(FILE, 'utf8', encryptAndWrite.bind({ key: cipherKey, outputFile: ENCRYPTED_FILE }));
// }
if (fs.existsSync(FILE) && isValidKey(cipherKey)) {
    encryptAndWrite(FILE, cipherKey, ENCRYPTED_FILE);
}
var decryptionKey = 26 - cipherKey;
if (fs.existsSync(ENCRYPTED_FILE) && isValidKey(decryptionKey)) {
    encryptAndWrite(ENCRYPTED_FILE, decryptionKey, DECRYPTED_FILE);
}
// Imports the Google Cloud client library
var Translate = require('@google-cloud/translate').v2.Translate;
var GOOGLE_APPLICATION_CREDENTIALS = "./credentials/credentials.json";
// Creates a client
var translate = new Translate({
    projectId: 'chrome-flight-389215',
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS
});
// translate the input file instead of the string
var textData = ["what are you dong?", "hi how are you"];
var targetLanguageCode = "es";
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
