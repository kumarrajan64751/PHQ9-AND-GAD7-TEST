const phq9Questions = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling or staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself — or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things, such as reading the newspaper or watching television',
  'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual',
  'Thoughts that you would be better off dead or of hurting yourself in some way'
];

const gad7Questions = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless that it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen'
];

const allQuestions = [...phq9Questions, ...gad7Questions];
const options = [
  { text: 'Not at all', value: 0 },
  { text: 'Several days', value: 1 },
  { text: 'More than half the days', value: 2 },
  { text: 'Nearly every day', value: 3 }
];

let currentQuestionIndex = 0;
let answers = [];

const questionNumberEl = document.getElementById('question-number');
const questionTextEl = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextButton = document.getElementById('next-button');
const quizContainer = document.getElementById('quiz-container');

function renderQuestion() {
  questionNumberEl.textContent = `Question ${currentQuestionIndex + 1} of ${allQuestions.length}`;
  questionTextEl.textContent = allQuestions[currentQuestionIndex];
  optionsContainer.innerHTML = '';
  options.forEach((option, index) => {
    const btn = document.createElement('button');
    btn.className = 'option-button';
    btn.textContent = option.text;
    btn.onclick = () => selectOption(index);
    optionsContainer.appendChild(btn);
  });
  nextButton.disabled = true;
}

function selectOption(index) {
  answers[currentQuestionIndex] = options[index].value;
  const buttons = document.querySelectorAll('.option-button');
  buttons.forEach(btn => btn.classList.remove('selected'));
  buttons[index].classList.add('selected');
  nextButton.disabled = false;
}

nextButton.addEventListener('click', () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < allQuestions.length) {
    renderQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  const phq9Score = answers.slice(0, 9).reduce((a, b) => a + b, 0);
  const gad7Score = answers.slice(9).reduce((a, b) => a + b, 0);

  const interpretPHQ9 = (score) => {
    if (score <= 4) return 'Minimal depression';
    if (score <= 9) return 'Mild depression';
    if (score <= 14) return 'Moderate depression';
    if (score <= 19) return 'Moderately severe depression';
    return 'Severe depression';
  };

  const interpretGAD7 = (score) => {
    if (score <= 4) return 'Minimal anxiety';
    if (score <= 9) return 'Mild anxiety';
    if (score <= 14) return 'Moderate anxiety';
    return 'Severe anxiety';
  };

  const phq9Interpretation = interpretPHQ9(phq9Score);
  const gad7Interpretation = interpretGAD7(gad7Score);

  // Determine the overall result
  const isPositive =
    phq9Interpretation === 'Minimal depression' &&
    gad7Interpretation === 'Minimal anxiety';

  // Set the appropriate animation class
  const resultClass = isPositive ? 'result-positive' : 'result-negative';

  // Determine recommendation based on PHQ-9 interpretation
  let recommendation = '';
  if (
    phq9Interpretation === 'Minimal depression' ||
    phq9Interpretation === 'Mild depression' ||
    phq9Interpretation === 'Moderate depression'
  ) {
    recommendation = `
      <p>Based on your responses, you may benefit from incorporating mindfulness exercises and techniques to maintain your mental health.</p>
      <p><a href="mindfulness.html" target="_blank">Explore Mindfulness Exercises</a></p>
      <p><a href="techniques.html" target="_blank">Learn Mental Health Techniques</a></p>
    `;
  } else {
    recommendation = `
      <p>Your responses suggest that it would be beneficial to consult a healthcare professional for further evaluation.</p>
      <p><a href="consult-doctor.html" target="_blank">Consult a Doctor</a></p>
    `;
  }

  quizContainer.innerHTML = `
    <h2>Assessment Results</h2>
    <p><strong>PHQ-9 Score:</strong> ${phq9Score} (${phq9Interpretation})</p>
    <p><strong>GAD-7 Score:</strong> ${gad7Score} (${gad7Interpretation})</p>
    ${recommendation}
  `;
  quizContainer.classList.add(resultClass);
}

// Initialize the quiz
renderQuestion();
