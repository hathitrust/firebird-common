export default {
  role: 'accordion',
  example: [
    `
      <div class="alert alert-block alert-info">Only one accordion in this group 1-4 will be open.</div>
      <details>
        <summary class="summary">
          <div class="summary">Accordion Item #1</div>
        </summary>
        <div class="panel">
          <p>This is just a panel.</p>
        </div>
      </details>
      <details>
        <summary class="summary">
          <div class="summary">Accordion Item #2</div>
        </summary>
        <div class="panel">
          <p>This is still a panel.</p>
        </div>
      </details>
      <details>
        <summary class="summary">
          <div class="summary">Accordion Item #3</div>
        </summary>
        <div class="panel">
          <p>This is yet another panel.</p>
        </div>
      </details>
      <details>
        <summary class="summary">
          <div class="summary">Accordion Item #4</div>
        </summary>
        <div class="panel">
          <p>This is yet more panel.</p>
        </div>
      </details>
    `,
    `
      <div class="alert alert-block alert-info">Only one accordion in this group A-D will be open.</div>
      <details>
        <summary class="summary">
          <div class="summary">Accordion Item #A</div>
        </summary>
        <div class="panel">
          <p>This is just a panel.</p>
        </div>
      </details>
      <details>
        <summary class="summary">
          <div class="summary">Accordion Item #B</div>
        </summary>
        <div class="panel">
          <p>This is still a panel.</p>
        </div>
      </details>
      <details>
        <summary class="summary">
          <div class="summary">Accordion Item #C</div>
        </summary>
        <div class="panel">
          <p>This is yet another panel.</p>
        </div>
      </details>
      <details>
        <summary class="summary">
          <div class="summary">Accordion Item #D</div>
        </summary>
        <div class="panel">
          <p>This is yet more panel.</p>
        </div>
      </details>
    `
  ]
}