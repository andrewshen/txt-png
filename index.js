import domtoimage from 'dom-to-image';
import 'regenerator-runtime/runtime';

const txt = document.getElementById('txt');

const setToClipboard = async (blob) => {
  const data = [new ClipboardItem({ [blob.type]: blob })];
  await navigator.clipboard.write(data);
};

const generateImage = () => {
  domtoimage
    .toBlob(txt)
    .then((blob) => {
      setToClipboard(blob);
    })
    .catch(function (error) {
      console.error('oops, something went wrong!', error);
    });
};

txt.addEventListener('input', (e) => generateImage());
txt.addEventListener('paste', (e) => {
  e.stopPropagation();
  e.preventDefault();
  let text = '';
  const event = e.originalEvent || e;
  if (event.clipboardData && event.clipboardData.getData) {
    text = event.clipboardData.getData('text/plain').trim();
  } else if (window.clipboardData && window.clipboardData.getData) {
    text = window.clipboardData.getData('Text').trim();
  }
  if (document.queryCommandSupported('insertText')) {
    document.execCommand('insertText', false, text);
  } else {
    document.execCommand('paste', false, text);
  }
});
txt.focus();
