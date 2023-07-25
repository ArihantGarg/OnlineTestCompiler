const { urlencoded } = require('body-parser');
const express = require('express');
const app=express();

const path = require('path');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.listen(8000 , function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT 8000");
});

app.get('/', (req,res)=>{
    const filePath = path.join(__dirname, 'index.html');
    res.sendFile(filePath);
})

//

const fs = require('fs');
const {c, cpp, node, python, java, default: compileRun} = require('compile-run');

const multer = require('multer');
const upload = multer({dest :'uploads/'})
const bodyParser = require('body-parser')
app.use(express.static("uploads"));
app.use(express.static("answercode"));

app.post('/submit',upload.single('code'), (req,res)=>{
    console.log(req.file);

    try {
        const filePath = path.join(__dirname, req.file.path);
        const data = fs.readFileSync(filePath, 'utf8');
        console.log(data);

        let resultPromise = cpp.runSource(data);
        resultPromise
            .then(result => {
                console.log(result);

                const answerfilePath = path.join(__dirname, 'answercode/answer.txt');
                const answerData = fs.readFileSync(answerfilePath, 'utf8');
                console.log(answerData);

                // Final check

                var data1 = result.stdout.replace(/\s/g, '');
                var data2 = answerData.replace(/\s/g, '');
                if(data1 === data2)
                    console.log("Success");
                else    
                    console.log("Failed");
                    console.log(data1);
                    console.log(data2);
            })
            .catch(err => {
                console.log(err);
            });
    }
    catch (err) {
        console.error(err);
    }

    res.redirect('/');
})

