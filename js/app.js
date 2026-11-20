// Scan to Wear hub: ONE link for the NFC tag.
// allow camera → scan any wearable picture → open that wearable's own live page.
import { WEARABLES, openUrl } from './wearables.js';
import { scan, stopScan, scanning } from './scan.js';

const $ = (id) => document.getElementById(id);
const q = new URLSearchParams(location.search);
let phase = 'perm';

const show = (id) => document.querySelectorAll('.screen').forEach((s) => s.classList.toggle('on', s.id === id));
const overlay = (id, on) => $(id).classList.toggle('on', on);


function openWearable(w){
  phase = 'found';
  stopScan();
  overlay('guide', false);
  $('foundName').textContent = w.name;
  $('foundSub').textContent = `${w.place}`;
  overlay('found', true);
  try { navigator.vibrate?.(40); } catch { /* no vibration */ }
  if (!q.has('nogo')) setTimeout(() => location.replace(openUrl(w)), 1100);
}

async function cameraGranted(){
  try { return (await navigator.permissions?.query({ name: 'camera' }))?.state === 'granted'; } catch { return false; }
}
async function openPerm(){
  phase = 'perm'; overlay('guide', false);
  if (await cameraGranted()) return openScan();
  if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia){
    $('permStatus').textContent = 'Open this link in Safari or Chrome to use the camera.';
    $('permBtn').disabled = true;
  }
  show('perm');
}
async function askCamera(){
  $('permBtn').disabled = true;
  $('permStatus').textContent = 'Tap Allow';
  try {
    const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    s.getTracks().forEach((t) => t.stop());
    $('permStatus').textContent = ''; show(null); openScan();
  } catch (err) {
    console.error(err);
    $('permStatus').textContent = err?.name === 'NotAllowedError'
      ? 'Camera blocked. Allow it in your browser settings.'
      : 'Camera did not start. Close other camera apps and try again.';
  } finally { $('permBtn').disabled = false; }
}
async function openScan(){
  phase = 'scan'; show(null); overlay('guide', true);
  if (scanning()) return;
  try {
    await scan($('ar'), WEARABLES.length, {
      onStatus: (t) => { if (phase === 'scan') $('scanStatus').textContent = t; },
      onFound: (i) => { if (phase !== 'scan') return; const w = WEARABLES.find((x) => x.index === i); if (w) openWearable(w); },
    });
  } catch (err) {
    console.error(err);
    const msg = String(err?.message || err?.name || err || '');
    $('scanStatus').textContent = /mind|fetch|404/i.test(msg) ? `Could not load the pictures.` : 'Camera not available. Allow it, then reload.';
  }
}

$('permBtn').addEventListener('click', askCamera);

openPerm();
window.__hub = { openWearable, WEARABLES };
