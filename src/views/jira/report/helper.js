async function copyFormattedText(html) {
  try {
    const blob = new Blob([html], {type: 'text/html'});
    const data = [new ClipboardItem({'text/html': blob})];
    await navigator.clipboard.write(data);
    console.log('Formatted text copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy formatted text: ', err);
  }
}

export {copyFormattedText};

[
  "https://ar.norton.com/",
  "https://br.norton.com/",
  "https://ca.norton.com/",
  "https://ca-fr.norton.com/",
  "https://pr.norton.com/",
  "https://lam.norton.com/",
  "https://cl.norton.com/",
  "https://co.norton.com/",
  "https://lam.norton.com/",
  "https://lam.norton.com/",
  "https://lam.norton.com/",
  "https://lam.norton.com/",
  "https://lam.norton.com/",
  "https://mx.norton.com/",
  "https://lam.norton.com/",
  "https://lam.norton.com/",
  "https://pr.norton.com/",
  "https://us.norton.com/",
  "https://lam.norton.com/",
  "https://lam.norton.com/",
  "https://be-nl.norton.com/",
  "https://be.norton.com/",
  "https://cz.norton.com/",
  "https://dk.norton.com/",
  "https://de.norton.com/",
  "https://es.norton.com/",
  "https://ie.norton.com/",
  "https://fr.norton.com/",
  "https://ie.norton.com/",
  "https://ie.norton.com/",
  "https://il.norton.com/",
  "https://it.norton.com/",
  "https://ie.norton.com/",
  "https://ie.norton.com/",
  "https://fr.norton.com/",
  "https://hu.norton.com/",
  "https://nl.norton.com/",
  "https://no.norton.com/",
  "https://at.norton.com/",
  "https://pl.norton.com/",
  "https://pt.norton.com/",
  "https://ro.norton.com/",
  "https://ch.norton.com/",
  "https://ch-fr.norton.com/",
  "https://ch-it.norton.com/",
  "https://za.norton.com/",
  "https://fi.norton.com/",
  "https://se.norton.com/",
  "https://tr.norton.com/",
  "https://ae.norton.com/",
  "https://uk.norton.com/",
  "https://gr.norton.com/",
  "https://ru.norton.com/",
  "https://au.norton.com/",
  "https://asia.norton.com/",
  "https://hk-en.norton.com/",
  "https://hk.norton.com/",
  "https://in.norton.com/",
  "https://asia.norton.com/",
  "https://malaysia.norton.com/",
  "https://nz.norton.com/",
  "https://asia.norton.com/",
  "https://sg.norton.com/",
  "https://asia.norton.com/",
  "https://asia.norton.com/",
  "https://kr.norton.com/",
  "https://cn.norton.com/",
  "https://tw.norton.com/",
  "https://jp.norton.com/"
]
