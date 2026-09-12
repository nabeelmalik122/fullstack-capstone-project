require('dotenv').config();
const express = require('express');
const natural = require("natural");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Natural sentiment analyzer setup
const Analyzer = natural.SentimentAnalyzer;
const stemmer = natural.PorterStemmer;
const analyzer = new Analyzer("English", stemmer, "afinn");

app.post('/sentiment', (req, res) => {
    const { sentence } = req.body;

    if (!sentence) {
        return res.status(400).json({ error: 'No sentence provided' });
    }

    // Tokenize the sentence into words
    const tokenizer = new natural.WordTokenizer();
    const tokenizedSentence = tokenizer.tokenize(sentence);

    // Get the sentiment score
    const score = analyzer.getSentiment(tokenizedSentence);

    let sentiment = "neutral";
    if (score < 0) {
        sentiment = "negative";
    } else if (score > 0.33) {
        sentiment = "positive";
    }

    res.json({ score: score, sentiment: sentiment });
});

app.listen(port, () => {
    console.log(`Sentiment service listening on port ${port}`);
});
