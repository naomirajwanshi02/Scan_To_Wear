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
  $('foundSub').textContent = w.place;
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
    $('permStatus').textContent = 'This browser cannot use the camera here. Open the page over https in Safari or Chrome.';
    $('permBtn').disabled = true;
  }
  show('perm');
}
async function askCamera(){
  $('permBtn').disabled = true;
  $('permStatus').textContent = 'Waiting for you to tap “Allow”…';
  try {
    const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    s.getTracks().forEach((t) => t.stop());
    $('permStatus').textContent = ''; show(null); openScan();
  } catch (err) {
    console.error(err);
    $('permStatus').textContent = err?.name === 'NotAllowedError'
      ? 'The camera was blocked. Allow the camera for this site in your browser settings, then tap Allow camera again.'
      : 'The camera did not start. Close other apps that use the camera and try again.';
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
    $('scanStatus').textContent = /mind|fetch|404/i.test(msg) ? `Could not load the picture data (${msg}).` : 'Camera not available. Allow camera access for this site, then reload the page.';
  }
}

$('permBtn').addEventListener('click', askCamera);

openPerm();
window.__hub = { openWearable, WEARABLES };
