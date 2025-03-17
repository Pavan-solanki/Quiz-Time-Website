document.addEventListener("DOMContentLoaded", ()=>{
    const startbtn=document.getElementById("start-btn");

    startbtn.addEventListener("click", registerUser);
})

function registerUser(){
    let username=document.getElementById("username").value.trim();

    if(username===""){
        alert("Please enter a username");
        return;
    }

    localStorage.setItem("username",username);
    window.location.href="quiz.html";
}
document.addEventListener("DOMContentLoaded", function () {
    let username = localStorage.getItem("username");
    if (!username && window.location.pathname !== "/index.html") {
    window.location.href = "index.html";
    }
    else {
        document.getElementById("userNameDisplay").innerText = `Welcome, ${username}`;
    }

    fetchQuestion();
});
let correctCount = 0;
let wrongCount = 0;
let currentQuestionIndex = 0;
let questions = [];
// async function fetchQuestion() {
//     try {
//         const url = 'https://quizmania-api.p.rapidapi.com/trivia';
//         const options = {
//             method: 'GET',
//             headers: {
//                 'x-rapidapi-key': '00ba1adc98mshde0fa90515c3c86p191f6ajsn68366f7a9d02',
//                 'x-rapidapi-host': 'quizmania-api.p.rapidapi.com'

//             }
//         };

//          const response = await fetch(url, options);
//         questions = await response.json();
//         console.log(questions[0]); // Debugging: Check API response format

//         if (questions.length > 0) {
//             currentQuestionIndex = 0; // Reset index
//             displayQuestion(questions[currentQuestionIndex]);
//         } else {
//             console.error("No questions found.");
//         }
//     } catch (error) {
//         console.error("Error fetching question:", error);
//     }
// }
async function fetchQuestion() {
    try {
        // const url = 'https://quizmania-api.p.rapidapi.com/trivia';
        

         const response = await fetch("https://opentdb.com/api.php?amount=50&category=9&type=multiple");
        questions = await response.json();
        console.log(questions.results[0]); // Debugging: Check API response format

        if (questions.results.length > 0) {
            currentQuestionIndex = 0; // Reset index
            displayQuestion(questions.results[currentQuestionIndex]);
        } else {
            console.error("No questions found.");
        }
    } catch (error) {
        console.error("Error fetching question:", error);
    }
}
function displayQuestion(questionData) {
    const questionText = questionData.question;
    const correctAnswer = questionData.correct_answer;
    let options = [...questionData.incorrect_answers, correctAnswer];

    // Shuffle options
    options = options.sort(() => Math.random() - 0.5);

    document.getElementById("question").innerHTML = questionText;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerHTML = option;
        btn.classList.add("option");
        btn.onclick = () => checkAnswer(btn, option, correctAnswer);
        optionsContainer.appendChild(btn);
    });
}

function checkAnswer(button, selectedAnswer, correctAnswer) {
    if (selectedAnswer === correctAnswer) {
        button.classList.add("correct");
        correctCount++; // ✅ Turns Green
    } else {
        button.classList.add("wrong"); // ❌ Turns Red
        wrongCount++;
    }

    // Disable all buttons
    document.querySelectorAll(".option").forEach(btn => btn.disabled = true);
    const optionsContainer = document.getElementById("options");
    const correctAnswerBtn = document.createElement("button");
    correctAnswerBtn.innerHTML = `✅ Correct Answer: ${correctAnswer}`;
    correctAnswerBtn.classList.add("correct-answer");
    optionsContainer.appendChild(correctAnswerBtn);

    updateScore();
    // Move to the next question after 2 seconds
    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.results.length) {
            displayQuestion(questions.results[currentQuestionIndex]);
        } else {
            // alert("Quiz Completed!");
            fetchQuestion(); // Restart the quiz
        }
    }, 2000);
}
function updateScore() {
    document.getElementById("correct-count").innerText = `✅ Correct: ${correctCount}`;
    document.getElementById("wrong-count").innerText = `❌ Wrong: ${wrongCount}`;
}
