const $ = id => document.getElementById(id);
const calcBtn = $('calcBtn');
const nowBtn = $('nowBtn');
const output = $('output');
const leaveAt = $('leaveAt');
const travDur = $('travDur');
const countdownRow = $('countdownRow');
const countdown = $('countdown');

function msToHMS(ms){
  const totalSec = Math.max(0, Math.round(ms/1000));
  const h = Math.floor(totalSec/3600);
  const m = Math.floor((totalSec%3600)/60);
  const s = totalSec%60;
  return `${h ? h+'h ' : ''}${m}m ${s}s`;
}

function compute(){
  const dist = parseFloat($('distance').value) || 0;
  const speed = parseFloat($('speed').value) || 0;
  const rawMeet = $('meetingTime').value;
  const bufferMin = parseInt($('buffer').value) || 0;

  if(!rawMeet || speed <= 0){
    alert('Please set a meeting time and a positive average speed.');
    return;
  }

  const meet = new Date(rawMeet);
  const travelHours = dist / speed;
  const travelMs = travelHours * 3600 * 1000;
  const bufferMs = bufferMin * 60 * 1000;

  const leaveTimeMs = meet.getTime() - travelMs - bufferMs;
  const now = Date.now();

  leaveAt.textContent = new Date(leaveTimeMs).toLocaleString();
  travDur.textContent = msToHMS(travelMs);

  if(leaveTimeMs > now){
    output.classList.remove('hidden');
    countdownRow.classList.remove('hidden');
    startCountdown(leaveTimeMs);
  } else {
    output.classList.remove('hidden');
    countdownRow.classList.add('hidden');
    clearInterval(window._ttlInterval);
  }
}

function startCountdown(targetMs){
  clearInterval(window._ttlInterval);
  function tick(){
    const rem = targetMs - Date.now();
    if(rem <= 0){
      countdown.textContent = "Leave now!";
      clearInterval(window._ttlInterval);
      return;
    }
    countdown.textContent = msToHMS(rem);
  }
  tick();
  window._ttlInterval = setInterval(tick, 500);
}

calcBtn.addEventListener('click', compute);
nowBtn.addEventListener('click', ()=>{
  const in15 = new Date(Date.now() + 15*60*1000);
  const tzOffset = in15.getTimezoneOffset() * 60000;
  const localISO = new Date(in15 - tzOffset).toISOString().slice(0,16);
  $('meetingTime').value = localISO;
});
