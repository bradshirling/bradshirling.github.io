// Add this before the existing JavaScript code
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon();
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
}

function updateThemeIcon() {
    const themeButton = document.getElementById('themeToggle');
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeButton.innerHTML = isDark ? '🌙' : '🌙';
}

const words = [
    "Data Structures",
    "Algorithms",
    "Operating Systems",
    "Computer Networks",
    "Database Systems",
    "Artificial Intelligence",
    "Machine Learning",
    "Cybersecurity",
    "Software Engineering",
    "Computer Architecture",
    "Distributed Systems",
    "Cloud Computing",
    "Parallel Computing",
    "Cryptography",
    "Web Development",
    "Mobile App Development",
    "Human Computer Interaction",
    "Natural Language Processing",
    "Embedded Systems",
    "Internet of Things",
    "Big Data",
    "Quantum Computing",
    "Computer Vision",
    "Augmented Reality",
    "Virtual Reality",
    "Game Development",
    "Blockchain",
    "Compiler Design",
    "Information Retrieval",
    "Computer Graphics",
    "Computer Simulation",
    "Pattern Recognition",
    "Bioinformatics",
    "Software Testing",
    "Network Security",
    "Ethical Hacking",
    "Automata Theory",
    "Formal Methods",
    "Numerical Analysis",
    "High Performance Computing",
    "Edge Computing",
    "Digital Signal Processing",
    "Information Theory",
    "Wireless Communication",
    "Software Development",
    "Data Mining",
    "Knowledge Representation",
    "Neural Networks",
    "Reinforcement Learning",
    "Robotics"
];

let word, guessWord, maxIncorrectGuesses, guessedLetters, score = 0;
const hangmanParts = document.querySelectorAll('.hangman-part');
let isEasyMode = false;
const MAX_ATTEMPTS = { normal: 6, easy: 10 };

function toggleDifficulty() {
    isEasyMode = !isEasyMode;
    document.getElementById('difficultyToggle').textContent = `Mode: ${isEasyMode ? 'Easy' : 'Normal'}`;
    init();
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(letter => {
    const button = document.createElement('button');
    button.className = 'key';
    button.textContent = letter.toUpperCase();
    button.addEventListener('click', () => processGuess(letter));
    keyboard.appendChild(button);
    });
}

function init() {
    word = words[Math.floor(Math.random() * words.length)];
    guessWord = Array.from(word).map(char => char === ' ' ? ' ' : '_');
    maxIncorrectGuesses = isEasyMode ? MAX_ATTEMPTS.easy : MAX_ATTEMPTS.normal;
    guessedLetters = new Set();

    // Reset all hangman parts
    document.querySelectorAll('.hangman-part').forEach(part => part.style.opacity = '0');
    
    // In normal mode, show base, pole and rope at start
    if (!isEasyMode) {
    const baseParts = document.querySelectorAll('.hangman-part:not(.easy-part)');
    for (let i = 0; i < 4; i++) {  // Changed from 3 to 4 to include base
        baseParts[i].style.opacity = '1';
    }
    }
    
    // Show/hide easy mode parts
    document.querySelectorAll('.easy-part').forEach(part => {
    part.style.display = isEasyMode ? 'block' : 'none';
    });
    
    // Enable all keyboard buttons
    const keys = document.getElementsByClassName('key');
    Array.from(keys).forEach(key => {
    if (key.id !== 'restartButton') {
        key.disabled = false;
    }
    });
    
    createKeyboard();
    updateDisplay();
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = 'message';
    document.getElementById('guessedLetters').textContent = 'Guessed letters: ';
}

function updateDisplay() {
    document.getElementById('wordDisplay').textContent = guessWord.join('');
    document.getElementById('attempts').textContent = maxIncorrectGuesses;
    document.getElementById('score').textContent = score;
    document.getElementById('guessedLetters').textContent = 'Guessed letters: ' + Array.from(guessedLetters).join(', ').toUpperCase();
}

function processGuess(letter) {
    if (guessedLetters.has(letter)) return;

    guessedLetters.add(letter);
    const button = [...document.getElementsByClassName('key')]
    .find(btn => btn.textContent === letter.toUpperCase());
    button.disabled = true;

    if (word.toLowerCase().includes(letter)) {
    let foundNew = false;
    for (let i = 0; i < word.length; i++) {
        if (word[i].toLowerCase() === letter) {
        guessWord[i] = word[i];
        foundNew = true;
        }
    }
    if (foundNew) {
        document.getElementById('message').textContent = `Good guess!`;
        document.getElementById('message').className = 'message correct';
    }
    } else {
    maxIncorrectGuesses--;
    document.getElementById('message').textContent = `Wrong guess!`;
    document.getElementById('message').className = 'message wrong';

    const standardParts = document.querySelectorAll('.hangman-part:not(.easy-part)');
    const easyParts = document.querySelectorAll('.easy-part');
    const totalAttempts = isEasyMode ? MAX_ATTEMPTS.easy : MAX_ATTEMPTS.normal;
    const attemptsUsed = totalAttempts - maxIncorrectGuesses;
    
    if (isEasyMode) {
        if (attemptsUsed === 1) {
        // Show base first in easy mode
        standardParts[0].style.opacity = '1';
        } else if (attemptsUsed <= standardParts.length) {
        standardParts[attemptsUsed - 1].style.opacity = '1';
        } else {
        easyParts[attemptsUsed - standardParts.length - 1].style.opacity = '1';
        }
    } else {
        // In normal mode, show parts sequentially starting after base, pole and rope
        if (attemptsUsed + 4 <= standardParts.length) {  // Changed from 3 to 4
        standardParts[attemptsUsed + 3].style.opacity = '1';
        }
    }
    }

    updateDisplay();

    if (!guessWord.includes('_')) {
    score += 10;
    document.getElementById('message').textContent = '🎉 You won! +10 points. Press New Game to continue!';
    document.getElementById('message').className = 'message correct';
    endGame();
    } else if (maxIncorrectGuesses === 0) {
    score = 0;
    document.getElementById('message').textContent = `Game Over! The word was: ${word}. Score reset to 0.`;
    document.getElementById('message').className = 'message wrong';
    endGame();
    }
}

function endGame() {
    const keys = document.getElementsByClassName('key');
    Array.from(keys).forEach(key => {
    if (key.id !== 'restartButton') {
        key.disabled = true;
    }
    });
}

// Add this to the DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('difficultyToggle').addEventListener('click', toggleDifficulty);
    init();
    document.getElementById('restartButton').addEventListener('click', init);
    document.addEventListener('keypress', (e) => {
    if (/^[a-z]$/.test(e.key)) {
        processGuess(e.key);
    }
    });
});
