let timer = 50*60;
const timerEl = document.getElementById('timer');
let questions = [];
let score = 0;
const pointPerQuestion = 2.5; // nilai per soal

// Timer
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

// Fetch soal JSON
fetch('https://raw.githubusercontent.com/airnetcso/app/main/soal.json')
.then(res=>res.json())
.then(data=>{
    questions = data;
    setupDashboard();
})
.catch(err=>alert("Gagal load soal"));

function setupDashboard(){
    const listeningGrid = document.getElementById('listeningGrid');
    const readingGrid = document.getElementById('readingGrid');

    let lNumber=1, rNumber=21;
    questions.forEach(q=>{
        const box = document.createElement('div');
        box.classList.add('box');
        box.dataset.id = q.id;

        if(q.audio){
            box.classList.add('listening');
            box.textContent = lNumber++;
            listeningGrid.appendChild(box);
        } else {
            box.classList.add('reading');
            box.textContent = rNumber++;
            readingGrid.appendChild(box);
        }

        box.onclick=()=>openModal(q, box);
    });
}

// Modal
const modal=document.getElementById('modal');
const questionText=document.getElementById('questionText');
const mediaDiv=document.getElementById('media');
const optionsDiv=document.getElementById('options');

function openModal(q, box){
    if(box.classList.contains('answered')) return;
    questionText.innerHTML=`<p>${q.question}</p>`;
    mediaDiv.innerHTML='';

    if(q.image) mediaDiv.innerHTML=`<img src="${q.image}">`;
    if(q.audio) mediaDiv.innerHTML=`<audio controls src="${q.audio}"></audio>`;

    optionsDiv.innerHTML='';
    q.options.forEach((opt,index)=>{
        const btn=document.createElement('button');
        btn.textContent=`${index+1}. ${opt}`;
        btn.onclick=()=>{
            if(opt===q.answer) score += pointPerQuestion; // 2.5 per soal
            box.classList.add('answered');
            box.dataset.answer=opt;
            closeModal();
        };
        optionsDiv.appendChild(btn);
    });
    modal.style.display='flex';
}

function closeModal(){ modal.style.display='none'; }

// Submit manual
document.getElementById('submitBtn').onclick = ()=>showResult();

// Review jawaban
document.getElementById('reviewBtn').onclick=()=>{
    const reviewList = questions.map(q=>{
        const answeredBox=document.querySelector(`.box[data-id="${q.id}"]`);
        const answered = answeredBox ? answeredBox.dataset.answer : 'Belum dijawab';
        const benar = q.answer;
        return `Soal ${q.id}: Jawaban = ${answered}, Benar = ${benar}`;
    }).join('\n');
    alert("Review Jawaban:\n"+reviewList);
};

// Reset / Ulangi
document.getElementById('resetBtn').onclick=()=>{
    if(!confirm("Yakin ingin mengulang? Semua jawaban akan hilang.")) return;
    score=0;
    timer=50*60;
    document.querySelectorAll('.box').forEach(b=>{
        b.classList.remove('answered');
        b.dataset.answer='';
    });
    document.querySelector('.container').style.display='block';
    document.querySelector('.controls').style.display='flex';
    document.getElementById('result').textContent='';
};

function showResult(){
    modal.style.display='none';
    document.querySelector('.container').style.display='none';
    document.querySelector('.controls').style.display='none';
    timerEl.style.display='none';
    document.getElementById('result').textContent=
        `Skor akhir: ${score} / ${questions.length * pointPerQuestion}`;
}
