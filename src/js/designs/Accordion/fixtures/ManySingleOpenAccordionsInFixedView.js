let panelsHTML = '';

for(let i = 1; i <= 10; i++) {
  let panelHTML = '';
  let numLines = ( i % 3 == 0 ) ? 10 : 5;
  for(let n = 1; n <= numLines; n++) {
    panelHTML += `<p>This is line ${n} in panel ${i}</p>`;
  }
  let detailsHTML = `<details>
    <summary class="summary">
      <div class="summary">Accordion Item #${i}</div>
    </summary>
    <div class="panel">
      ${panelHTML}
    </div>
  </details>`;
  panelsHTML += detailsHTML;
}

export default {
  role: 'accordion',
  example: `
    <div class="alert alert-block alert-info"><p>Only one accordion will be open.</p></div>
    <div class="border" style="height: 60vh; overflow: scroll; padding: 0.5rem;">${panelsHTML}</div>`
}