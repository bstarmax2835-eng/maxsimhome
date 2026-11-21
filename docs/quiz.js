import { createQuiz } from './src/quizState.js';

const $ = (id) => document.getElementById(id);

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function stripes(swatch) {
  const box = el('div', 'v sw');
  box.setAttribute('aria-hidden', 'true');
  for (const c of swatch) {
    const s = el('span');
    s.style.background = c;
    box.append(s);
  }
  return box;
}

// An image when the build found one, otherwise a generated fallback card.
function visual({ image, swatch, emoji, alt }, bg) {
  if (image) {
    const box = el('div', 'v');
    const img = el('img');
    img.src = image;
    img.alt = ''; // decorative: every card also carries its text label
    img.loading = 'lazy';
    box.append(img);
    return box;
  }
  if (swatch) return stripes(swatch);
  const box = el('div', 'v', emoji);
  box.setAttribute('aria-hidden', 'true');
  box.style.background = bg;
  return box;
}

async function start() {
  const [questions, styles] = await Promise.all(
    ['data/quiz.json', 'data/styles.json'].map((u) => fetch(u).then((r) => r.json())),
  );
  const keys = styles.map((s) => s.key);
  const styleByKey = Object.fromEntries(styles.map((s) => [s.key, s]));
  let quiz = createQuiz(questions, keys);

  for (const s of styles) {
    const card = el('div', 'scard');
    const v = visual({ image: s.image, emoji: s.emoji, alt: `${s.name} style example room` }, s.colors.bg);
    const strip = stripes(s.swatch);
    strip.className = 'strip';
    card.append(v, strip);
    const body = el('div', 'b');
    body.append(el('b', '', s.name), el('small', '', s.tagline));
    card.append(body);
    $('styleCards').append(card);
  }

  function show(id) {
    for (const s of ['start', 'quiz']) $(s).hidden = s !== id;
    $('restartTop').hidden = id === 'start';
    window.scrollTo(0, 0);
  }

  function finish() {
    const { style } = quiz.result();
    const slug = styleByKey[style].slug;
    // Step back so the quiz is not "done" if the browser restores this page after Back:
    // the visitor can then pick a different answer and it counts.
    quiz.back();
    location.href = `./${slug}/`;
  }

  function render() {
    const { index, question } = quiz.current();
    $('bar').style.width = `${(index / questions.length) * 100}%`;
    $('count').textContent = `Question ${index + 1} of ${questions.length}`;
    $('prompt').textContent = question.prompt;
    $('backBtn').style.visibility = index === 0 ? 'hidden' : 'visible';
    $('prompt').focus(); // keep keyboard and screen-reader users in place after the options are replaced

    const opts = $('opts');
    opts.replaceChildren();
    const isVisual = question.options.some((o) => o.style);
    opts.className = isVisual ? 'opts vis' : 'opts';

    question.options.forEach((o, i) => {
      const b = el('button', isVisual ? 'vopt' : 'opt');
      b.type = 'button';
      if (isVisual) {
        const bg = styleByKey[o.style].colors.bg;
        b.append(visual({ ...o, alt: o.label }, bg), el('div', 'cap', o.label));
      } else {
        b.append(el('b', '', '$'.repeat(i + 1)), el('span', '', o.label));
      }
      b.addEventListener('click', () => {
        quiz.answer(i);
        quiz.isDone() ? finish() : render();
      });
      opts.append(b);
    });
  }

  function restart() {
    quiz = createQuiz(questions, keys);
    show('start');
  }

  $('startBtn').addEventListener('click', () => { quiz = createQuiz(questions, keys); render(); show('quiz'); });
  $('backBtn').addEventListener('click', () => { quiz.back(); render(); });
  $('restartTop').addEventListener('click', restart);
}

start().catch(() => {
  $('start').hidden = true;
  $('error').hidden = false;
});
