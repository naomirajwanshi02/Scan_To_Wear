// MindAR image tracking (mind-ar 1.2.5 + three 0.160.0, same pins as the wearable apps).
// targets.mind holds ONE picture per wearable; the index of the picture that is found
// tells us which wearable to open.
export const TARGET_SRC = new URLSearchParams(location.search).get('target') || './targets.mind';
let current = null;

export async function scan(container, count, { onStatus, onFound }){
  stopScan();
  onStatus('Loading the scanner');
  const { MindARThree } = await import('mindar-image-three');
  const mindar = new MindARThree({
    container, imageTargetSrc: TARGET_SRC, uiScanning: 'no', uiLoading: 'no', uiError: 'no',
    filterMinCF: 0.001, filterBeta: 1000, warmupTolerance: 3, missTolerance: 10, maxTrack: count,
  });
  current = mindar;
  for (let i = 0; i < count; i++) mindar.addAnchor(i).onTargetFound = () => onFound(i);
  onStatus('Starting camera');
  try { await mindar.start(); } catch (e){ stopScan(); throw e || new Error('camera unavailable'); }
  mindar.renderer.setAnimationLoop(() => mindar.renderer.render(mindar.scene, mindar.camera));
  onStatus('Looking for a picture');
}

export const scanning = () => !!current;

export function stopScan(){
  if (!current) return;
  const m = current; current = null;
  try { m.renderer.setAnimationLoop(null); } catch { /* fine */ }
  try { m.controller.stopProcessVideo(); } catch { /* fine */ }
  try { m.stop(); } catch { /* never started */ }
  try { m.renderer.dispose(); } catch { /* fine */ }
  const c = m.container;
  if (c){ c.querySelectorAll('video').forEach((v) => v.srcObject?.getTracks?.().forEach((t) => t.stop())); c.innerHTML = ''; }
}
