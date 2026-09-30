export const downloadStandaloneHtml = async () => {
  try {
    const res = await fetch('/colossal_cave.html');
    if (res.ok) {
      const htmlText = await res.text();
      const blob = new Blob([htmlText], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'colossal-cave-adventure.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    }
  } catch (err) {
    console.error('Download failed, using fallback generator', err);
  }
  return false;
};
