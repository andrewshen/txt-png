import { toPng } from 'dom-to-image';
import { changeDpiDataUrl } from 'changedpi';
import 'regenerator-runtime/runtime';

const BASE_DPI = 72;
const scale = window.devicePixelRatio;
const txt = document.getElementById('txt');
const txtWrapper = document.getElementById('txt-wrapper');

const processText = (text) => {
  return text.replaceAll("'", '’').trim();
};

const setToClipboard = async (blob) => {
  const data = [new ClipboardItem({ [blob.type]: blob })];
  await navigator.clipboard.write(data);
};

const generateImage = async () => {
  let dataUrl = await toPng(txtWrapper, {
    height: txtWrapper.offsetHeight * scale,
    width: txtWrapper.offsetWidth * scale,
    style: {
      transform: `scale(${scale})`,
      transformOrigin: 'top left',
      width: `${txtWrapper.offsetWidth}px`,
      height: `${txtWrapper.offsetHeight}px`,
    },
  });

  dataUrl = changeDpiDataUrl(dataUrl, BASE_DPI * scale);
  const data = await fetch(dataUrl);
  const blob = await data.blob();
  await setToClipboard(blob);
};

txt.addEventListener('input', (e) => generateImage());
txt.addEventListener('paste', (e) => {
  e.stopPropagation();
  e.preventDefault();
  let text = '';
  const event = e.originalEvent || e;
  if (event.clipboardData && event.clipboardData.getData) {
    text = processText(event.clipboardData.getData('text/plain'));
  } else if (window.clipboardData && window.clipboardData.getData) {
    text = processText(window.clipboardData.getData('Text').trim());
  }
  if (document.queryCommandSupported('insertText')) {
    document.execCommand('insertText', false, text);
  } else {
    document.execCommand('paste', false, text);
  }
});
txt.focus();
