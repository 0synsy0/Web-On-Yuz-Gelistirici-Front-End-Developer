// API url
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

let questions = [];

let quizStarted = false;
let currentQuestionIndex = 0;
let timer;


fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
 
    questions = data.slice(0, 10); 
    setupQuiz();
  })
  .catch(error => {
    console.log('API hatası:', error);
  });

function setupQuiz() {
  const startButton = document.getElementById('start-button');
  const questionContainer = document.getElementById('question-container');
  const resultContainer = document.getElementById('result-container');
  const submitButton = document.getElementById('submit-button');
  const questionCounter = document.getElementById('question-counter');
  let choicesListElement;
  const userAnswers = [];

  startButton.addEventListener('click', () => {
    quizStarted = true;
    startButton.style.display = 'none';
    questionContainer.style.display = 'block';
    showQuestion();
    startTimer();
  });

  submitButton.addEventListener('click', () => {
    if (quizStarted) {
      submitAnswer();
    }
  });

  function showQuestion() {
    const question = questions[currentQuestionIndex];

    const questionTitleElement = document.getElementById('question-title');
    questionTitleElement.textContent = question.body;

    choicesListElement = document.getElementById('choices-list');
    choicesListElement.innerHTML = '';

    const choices = parseChoices(question.body);

    choices.forEach((choice, index) => {
      const inputElement = document.createElement('input');
      inputElement.type = 'radio';
      inputElement.name = 'choice';
      inputElement.value = index;
      inputElement.id = `choice-${index}`;

      const labelElement = document.createElement('label');
      labelElement.textContent = choice;
      labelElement.setAttribute('for', `choice-${index}`);

      choicesListElement.appendChild(inputElement);
      choicesListElement.appendChild(labelElement);
      choicesListElement.appendChild(document.createElement('br'));
    });

    questionCounter.textContent = `Soru ${currentQuestionIndex + 1}/${questions.length}`;
  }

  function parseChoices(questionText) {
    const regex = /(.+)\n(.+)\n(.+)\n(.+)/s;
    const matches = questionText.match(regex);
    if (matches) {
      return [matches[1], matches[2], matches[3], matches[4]];
    }
    return [];
  }

  function startTimer() {
    let counter = 30;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
      timerElement.textContent = `Kalan süre: ${counter} saniye`;

      timer = setInterval(() => {
        counter--;
        timerElement.textContent = `Kalan süre: ${counter} saniye`;

        if (counter === 20) {
          submitButton.disabled = false;
        }

        if (counter === 0) {
          clearInterval(timer);
          submitAnswer();
        }
      }, 1000);
    }
  }

  function submitAnswer() {
    clearInterval(timer);

    const choices = choicesListElement.querySelectorAll('input[type="radio"]');

    choices.forEach(input => {
      input.disabled = true;
    });

    const selectedChoice = Array.from(choices).find(choice => choice.checked);
    const userAnswer = selectedChoice ? selectedChoice.nextSibling.textContent : '-';
    saveUserAnswer(currentQuestionIndex, userAnswer);

    userAnswers.push({
      question: questions[currentQuestionIndex].body,
      userAnswer: userAnswer,
      correctAnswer: getCorrectAnswer(currentQuestionIndex),
      timeLeft: timer.textContent
    });

    setTimeout(() => {
      currentQuestionIndex++;
      if (currentQuestionIndex < questions.length) {
        showQuestion();
        startTimer();
        submitButton.disabled = true;
      } else {
        showResults();
      }
    }, 1000);
  }

  function saveUserAnswer(questionIndex, answer) {
    questions[questionIndex].userAnswer = answer;
  }

  function getCorrectAnswer(questionIndex) {
    const question = questions[questionIndex];
    return question.title;
  }

  function showResults() {
    const questionContainer = document.getElementById('question-container');
    const resultContainer = document.getElementById('result-container');
    questionContainer.style.display = 'none';
    resultContainer.style.display = 'block';

    const resultTableBody = document.getElementById('result-table-body');
    resultTableBody.innerHTML = '';

    userAnswers.forEach(userAnswer => {
      const row = document.createElement('tr');

      const questionCell = document.createElement('td');
      questionCell.textContent = userAnswer.question;
      row.appendChild(questionCell);

      const userAnswerCell = document.createElement('td');
      userAnswerCell.textContent = userAnswer.userAnswer;
      row.appendChild(userAnswerCell);
      userAnswerCell.style.backgroundColor = 'red';
      userAnswerCell.style.color = 'white';
      userAnswerCell.style.padding = '10px';
      userAnswerCell.style.borderRadius = '5px';

      const correctAnswerCell = document.createElement('td');
      correctAnswerCell.textContent = userAnswer.correctAnswer;
      row.appendChild(correctAnswerCell);
      correctAnswerCell.style.backgroundColor = 'green';
      correctAnswerCell.style.color = 'white';
      correctAnswerCell.style.padding = '10px';
      correctAnswerCell.style.borderRadius = '5px';

      resultTableBody.appendChild(row);
    });
  }
}
