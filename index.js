import domtoimage from 'dom-to-image';
import 'regenerator-runtime/runtime';

const txt = document.getElementById('txt');
const img = document.getElementById('img');

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

document
  .getElementById('txt')
  .addEventListener('input', (event) => generateImage());
