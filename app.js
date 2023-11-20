const express = require('express');
const mongoose = require('mongoose');
const Question = require('./model/Question')
const cors = require('cors'); 

const app = express();
const port = 3000;

app.use(cors());    
app.use(express.json({ limit: "50mb" }));
app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
// Connect to MongoDB
mongoose.connect('mongodb+srv://botb20854:L8ARjsI4TZdLchPq@cluster0.pcgalin.mongodb.net/questionPaperDB?retryWrites=true&w=majority');


// Only For testing propose get all Question including easy medium hard
app.get('/questions', async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Create Question
app.post('/question', async (req, res) => {
    try {
        const question = new Question(req.body);
        const savedQuestion = await question.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(500).json(error);
    }
});


//Get Question Paper
app.get('/paper', async (req, res) => {
    try {
        let Easy = req.query.easy;
        let Medium = req.query.medium;
        let Hard = req.query.hard;
        const allEasyQuestions = await Question.find({ difficulty: 'Easy' }).sort({ marks: -1 });
        const easyQuestion = addQuestion(allEasyQuestions, Easy)
        const allMediumQuestions = await Question.find({ difficulty: 'Medium' }).sort({ marks: -1 });
        const mediumQuestion = addQuestion(allMediumQuestions, Medium)
        const allHardQuestions = await Question.find({ difficulty: 'Hard' }).sort({ marks: -1 });
        const hardQuestion = addQuestion(allHardQuestions, Hard)

        res.status(200).json([ ...easyQuestion, ...mediumQuestion, ...hardQuestion ]);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



function addQuestion(arr, mark) {
    let paper = [];
    arr.forEach(obj => {
        if (obj.marks <= mark) {
            paper.push(obj);
            mark = mark - obj.marks;
        }
        if (mark == 0) {
            return;
        }
    });
    return paper;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
