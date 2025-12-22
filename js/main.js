// Timer 50 menit
let timer = 50*60;
const timerEl = document.getElementById('timer');

setInterval(()=>{
  let minutes = Math.floor(timer/60);
  let seconds = timer%60;
  if(seconds<10) seconds='0'+seconds;
  timerEl.textContent = `Waktu: ${minutes}:${seconds}`;
  timer--;
  if(timer<0){
    alert("Waktu habis!");
    showResult();
  }
},1000);

let questions = [];
let score = 0;

// Fetch soal dari raw GitHub URL
fetch('https://raw.githubusercontent.com/airnetcso/app/main/soal.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    setupDashboard();
  })
  .catch(err => alert("Gagal load soal"));

function setupDashboard() {
  const listeningGrid = document.getElementById('listeningGrid');
  const readingGrid = document.getElementById('readingGrid');

  let lNumber = 1;
  let rNumber = 21;

  questions.forEach(q => {
    const box = document.createElement('div');
    box.classList.add('box');

    if(q.audio){
      box.classList.add('listening');
      box.textContent = lNumber;
      lNumber++;
      listeningGrid.appendChild(box);
    } else {
      box.classList.add('reading');
      box.textContent = rNumber;
      rNumber++;
      readingGrid.appendChild(box);
    }

    box.onclick = () => openModal(q, box);
  });
}

// Modal
const modal = document.getElementById('modal');
const questionText = document.getElementById('questionText');
const mediaDiv = document.getElementById('media');
const optionsDiv = document.getElementById('options');

function openModal(q, box){
  if(box.classList.contains('answered')) return;
  questionText.innerHTML = `<p>${q.question}</p>`;
  mediaDiv.innerHTML = '';

  if(q.image) mediaDiv.innerHTML = `<img src="${q.image}">`;
  if(q.audio) mediaDiv.innerHTML = `<audio controls src="${q.audio}"></audio>`;

  optionsDiv.innerHTML = '';
  q.options.forEach((opt,index) => {
    const btn = document.createElement('button');
    btn.textContent = `${index+1}. ${opt}`;
    btn.onclick = () => {
      if(opt === q.answer) score++;
      box.classList.add('answered');
      closeModal();

      // auto submit jika semua soal dijawab
      const allAnswered = document.querySelectorAll('.box.answered').length === questions.length;
      if(allAnswered) showResult();
    };
    optionsDiv.appendChild(btn);
  });

  modal.style.display = 'flex';
}

function closeModal(){
  modal.style.display = 'none';
}

// tombol submit manual
document.getElementById('submitBtn').onclick = ()=>{
    const unanswered = document.querySelectorAll('.box:not(.answered)').length;
    if(unanswered>0){
        if(!confirm(`Masih ada ${unanswered} soal belum dijawab. Tetap submit?`)) return;
    }
    showResult();
};

function showResult(){
  modal.style.display = 'none';
  document.querySelector('.container').style.display = 'none';
  document.querySelector('.controls').style.display = 'none';
  timerEl.style.display = 'none';
  document.getElementById('result').textContent = `Skor akhir: ${score} / ${questions.length}`;
}
