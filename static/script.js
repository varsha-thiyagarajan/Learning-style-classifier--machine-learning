document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const nextBtn = document.getElementById("next-btn");
  const restartBtn = document.getElementById("restart-btn");
  const questionContainer = document.getElementById("question-container");
  const questionText = document.getElementById("question-text");
  const choicesList = document.getElementById("choices-list");
  const resultContainer = document.getElementById("result-container");
  const scoreDisplay = document.getElementById("score");
const genderAgeSection = document.getElementById("gender_and_age");

  const questions = [
    "I learn better by reading what the teacher writes on the chalkboard.",
     "When I read instructions, I remember them better.",
     "I understand better when I read instructions.",
     "I learn better by reading than by listening to someone.",
     "I learn more by reading textbooks than by listening to lectures.",
    "When the teacher tells me the instructions I understand better.",
    "When someone tells me how to do something in class, I learn it better.",
    "I remember things I have heard in class better than things I have read.",
    "I learn better in class when the teacher gives a lecture.",
    "I learn better in class when I listen to someone.",
    "I prefer to learn by doing something in class.",
    "When I do things in class, I learn better.",
    "I enjoy learning in class by doing experiments.",
    "I understand things better in class when I participate in role-playing.",
    "I remember lessons more clearly when I act them out or perform them."
  ];

  const choices = [
    { label: "Strongly Disagree", value: 1 },
    { label: "Disagree", value: 2 },
    { label: "Neutral", value: 3 },
    { label: "Agree", value: 4 },
    { label: "Strongly Agree", value: 5 }
  ];

  let currentQuestionIndex = 0;
  let userAnswers = [];

  startBtn.addEventListener("click", startQuiz);
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      showQuestion();
    } else {
      showResult();
    }
  });

  restartBtn.addEventListener("click", () => {
    currentQuestionIndex = 0;
    userAnswers = [];
    resultContainer.classList.add("hidden");
    genderAgeSection.classList.remove("hidden");
    startBtn.classList.remove("hidden");
    questionContainer.classList.add("hidden");
    questionText.textContent = "";
    choicesList.innerHTML = "";
    nextBtn.classList.add("hidden");
  });
 function startQuiz() {
  
  startBtn.classList.add("hidden");

 
  resultContainer.classList.add("hidden");

  questionContainer.classList.remove("hidden");

 ``             
  genderAgeSection.classList.add("hidden");
  genderAgeSection.style.display = "none"; 
  showQuestion();
}

  function showQuestion() {
    nextBtn.classList.add("hidden");
    questionText.textContent = `Q${currentQuestionIndex + 1}: ${questions[currentQuestionIndex]}`;
    choicesList.innerHTML = "";
    choices.forEach((choice) => {
      const li = document.createElement("li");
      li.textContent = choice.label;
      li.classList.add("choice");
      li.addEventListener("click", () => selectAnswer(choice.value));
      choicesList.appendChild(li);
    });
  }
  function selectAnswer(value) {
    userAnswers.push({
      question: questions[currentQuestionIndex],
      answer: value
    });
    nextBtn.classList.remove("hidden");
  }

  function showResult() {
  questionContainer.classList.add("hidden");
  resultContainer.classList.remove("hidden");
  const gender = document.getElementById("gender").value;
  const age = document.getElementById("age").value;

  const finalData = {
    gender: parseInt(gender),
    age: parseInt(age),
    responses: userAnswers.map(item => item.answer)
  };

  fetch('/predict', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(finalData)
  })
  .then(response => response.json())
  .then(data => {
    if (data.learning_style) {
      
      window.location.href = `/result/${data.learning_style}`;
    } else {
      scoreDisplay.textContent = 'Error: Could not predict.';
    }
  })
  .catch(error => {
    scoreDisplay.textContent = 'Error: Could not predict.';
    console.error('Prediction error:', error);
  });
}

    
});