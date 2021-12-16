const fs = require('fs');
const https = require('https');

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
let words = [];

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const getWordsAsync = (letter, page) => {
    return new Promise((resolve, reject) => {
        https.get(`https://www.dictionary.com/e/crb-ajax/cached.php?page=${page}&wordLength=5&letter=${letter}&action=get_wf_widget_page&pageType=4&nonce=92162bda88`, res => {
            let body = '';
            res.on('data', chunk => {
                body += chunk;
            });
            res.on('end', function() {
                const payload = JSON.parse(body);
                if (payload.success) {
                    resolve(payload.data.words);
                } else {
                    resolve([]);
                }
            });
        }).on('error', err => {
            reject(err);
        });
    });
};

const getAllWordsAsync = async () => {
    for (var i = 0; i < alphabet.length; i++) {
        console.log(alphabet.charAt(i));
        let response = [];
        let page = 1;
        do {
            response = await getWordsAsync(alphabet.charAt(i), page);
            words = words.concat(response);
            page++;
            await sleep(300);
        } while (response.length);
    }
    fs.unlink('words.ts', function (err) {
        if (err) throw err;
    });
    const wordObject = {};
    words.forEach((word) => {
        wordObject[word] = word;
    })
    fs.appendFileSync('word-dictionary.ts', `export const words = ${JSON.stringify(wordObject)};`);
};

getAllWordsAsync();
