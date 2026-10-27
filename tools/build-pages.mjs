// susa-night.html 로 index.html 을 만든다.
//
// susa-night.html 은 Claude 아티팩트용 형식이라 <!doctype>, <html>, <head>, <body> 가 없다.
// (아티팩트 플랫폼이 게시할 때 그 껍데기를 자동으로 씌워 준다.)
// GitHub Pages 는 파일을 그대로 내보내므로, 껍데기가 없으면 quirks 모드로 렌더링된다.
// 그래서 여기서 같은 껍데기를 직접 씌워 index.html 로 떨군다.
//
//   node tools/build-pages.mjs
//
// susa-night.html 을 고친 뒤에는 이 스크립트를 다시 돌리고 둘 다 커밋한다.

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(root, 'susa-night.html');
const OUT = join(root, 'index.html');

const src = readFileSync(SRC, 'utf8');

// <style> 블록까지가 head 에 들어갈 몫, 그 뒤가 body 다.
const marker = '</style>';
const cut = src.indexOf(marker);
if (cut < 0) throw new Error('susa-night.html 에서 </style> 를 찾지 못했습니다.');

const head = src.slice(0, cut + marker.length).trim();
const body = src.slice(cut + marker.length).trim();

// 아티팩트 플랫폼이 씌워 주는 기본 리셋과 같은 내용.
// 게임 CSS 보다 먼저 와야 :root { color-scheme: dark } 가 이것을 덮는다.
const reset = `<style>
  :root{
    color-scheme: light;
    padding-top: env(safe-area-inset-top, 0px);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  body{ margin:0; font:14px system-ui, -apple-system, sans-serif }
  img{ max-width:100% }
  [hidden]{ display:none !important }
</style>`;

const out = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="에스더서 10장을 10막으로 옮긴 선택형 궁중 드라마. 성경에 적힌 자리에서 다르게 고르면 그 자리에서 이야기가 끝난다.">
${reset}
${head}
</head>
<body>
${body}
</body>
</html>
`;

writeFileSync(OUT, out, 'utf8');
console.log(`index.html 을 다시 만들었습니다. (${out.length.toLocaleString('ko-KR')}자)`);
