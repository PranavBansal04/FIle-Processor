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
var getLineReader = function (filePath) {
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
};
var isValidUrl = function (urlString) {
    try {
        var url = new URL(urlString);
    }
    catch (_) {
        return false;
    }
    return true;
};
// object signature
var countWords = function (fileData, line) {
    var words = line.split(" ");
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
        if (currentWord in newFileData) {
            newFileData[currentWord] = __assign(__assign({}, newFileData[currentWord]), { count: newFileData[currentWord].count + 1 });
        }
        else {
            newFileData[currentWord] = { value: currentWord, count: 1 };
        }
    });
    return newFileData;
};
var getMostAndLeast = function (data, n) {
    // console.log(data)
    var wordCount = [];
    Object.keys(data).forEach(function (key) {
        wordCount.push(data[key]);
    });
    wordCount.sort(function (a, b) {
        return b.count - a.count;
    });
    // console.log(wordCount.slice(0, 10), wordCount.slice(wordCount.length - 10, wordCount.length))
    return [wordCount.slice(0, n), wordCount.slice(wordCount.length - n, wordCount.length)];
};
// const processFile = (fileName: string): Response<wordDictObject> => {
//     const [error, lineReader] = getLineReader(fileName);
//     if (error !== null) {
//         return [error, null]
//     }
//     let data: wordDictObject = {};
//     // the data object seems to lose all the values if returned without the on close event? why is that happening?
//     lineReader
//         .on('line', (line) => {
//             data = { ...countWords({ ...data }, line) };
//         })
//         .on('close', function () {
//             if (Object.keys(data).length === 0) {
//                 return [new Error("No data found!"), null]
//             }
//             console.log(Object.keys(data).length)
//             return [null, data]
//         })
//     console.log(Object.keys(data).length);
//     return [new Error("Errors gathering data!"), null]
// }
var encryptor = function (char, cipher) {
    var charCode = char.charCodeAt(0);
    // A = 65, Z = 90
    // a = 97, z = 122
    return String.fromCharCode(((charCode + cipher) <= 122) ? charCode + cipher
        : (charCode + cipher) % 122 + 96);
};
var encryptText = function (text) {
    try {
        var cipher_1 = Math.floor(1 + Math.random() * 17);
        console.log("Offset for encryption : ", cipher_1);
        text = text.toLowerCase();
        var encryptedText = text.replace(/[a-z]/g, function (x) { return encryptor(x, cipher_1); });
        if (encryptedText === null || encryptedText === null) {
            return [new Error("Empty file!"), null];
        }
        return [null, encryptedText];
    }
    catch (error) {
        return [error, null];
    }
};
// create a decryptor and accept cipher as input
function processFile(fileName) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, error, lineReader, data;
        return __generator(this, function (_b) {
            _a = getLineReader(fileName), error = _a[0], lineReader = _a[1];
            if (error !== null) {
                // return new Promise((resolve) => {
                //     resolve();
                // });
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
// const [error, data] = processFile("input.txt");
// if (error !== null) {
//     console.log(error);
// }
// else {
//     let numWords = 10
//     getMostAndLeast(data, numWords);
// }
var FILE = "./data/input.txt";
var OUTPUTFILE = "./data/output.txt";
var promise = processFile(FILE);
promise.then(function (_a) {
    var error = _a[0], data = _a[1];
    if (error !== null) {
        console.log(error);
    }
    else {
        var numWords = 10;
        // console.log(Object.keys(data).length);
        var results = getMostAndLeast(data, numWords);
        console.log("Most commonly used words : ", results[0]);
        console.log("Least commonly used words : ", results[1]);
    }
});
function encryptAndWrite(err, fileText) {
    if (err) {
        return;
    }
    var _a = encryptText(fileText), error = _a[0], encryptedText = _a[1];
    if (error !== null) {
        return;
    }
    fs.writeFile(OUTPUTFILE, encryptedText, logErrors);
    console.log("File encrypted successfully at - ", OUTPUTFILE);
}
function logErrors(err) {
    // In case of a error throw err.
    if (err)
        console.log(err);
}
// ENCRYPTION
if (fs.existsSync(FILE)) {
    fs.readFile(FILE, 'utf8', encryptAndWrite);
}
// Imports the Google Cloud client library
var Translate = require('@google-cloud/translate').v2.Translate;
var GOOGLE_APPLICATION_CREDENTIALS = "./credentials/credentials.json";
// Creates a client
var translate = new Translate({
    projectId: 'chrome-flight-389215',
    keyFilename: GOOGLE_APPLICATION_CREDENTIALS
});
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
                    // return new Promise((resolve) => {
                    //     resolve();
                    // });
                    return [2 /*return*/, [null, translations[0]]];
                case 2:
                    error_1 = _a.sent();
                    // return new Promise((resolve) => {
                    //     resolve([error, null]);
                    // });
                    return [2 /*return*/, [error_1, null]];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// async function translateText(text: string[], target: string) {
//     let [translations] = await translate.translate(text, target);
//     translations = Array.isArray(translations) ? translations : [translations];
//     translations.forEach((translation, i) => {
//         console.log("Original => ", text[i])
//         console.log("Translated => ", translation);
//     });
// }
// translate the input file instead of the stribng
var textData = ["what are you dong?", "hi how are you"];
var targetLanguageCode = "es";
var translatePromise = translateText(textData, targetLanguageCode);
translatePromise.then(displayTranslations);
function displayTranslations(_a) {
    var error = _a[0], translations = _a[1];
    if (error !== null) {
        console.log(error);
        return;
    }
    translations.forEach(displayTranslation);
}
function displayTranslation(translation, i) {
    console.log("[".concat(i + 1, "]"));
    console.log("Original => ", textData[i]);
    console.log("Translated => ", translation);
}
