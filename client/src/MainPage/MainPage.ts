import { useStateNoRender, useDocument } from '@react';
import { useRedirection } from '@router';

import classNames from 'classnames/bind';
import style from './MainPage.module.scss';
const cx = classNames.bind(style);

function MainPage() {
  const [value, setValue] = useStateNoRender('');

  const onChange = (e: Event) => {
    const { value: val } = e.target as HTMLInputElement;
    setValue(val);
  };

  const onMakeRoom = () => {
    useRedirection(`chat-room/${value()}`);
  };

  useDocument(() => {
    const input = document.querySelector('.input-box');
    const makeBtn = document.querySelector('.make-btn');

    input?.addEventListener('input', onChange);
    makeBtn?.addEventListener('click', onMakeRoom);

    return () => {
      input?.removeEventListener('input', onChange);
      makeBtn?.removeEventListener('click', onMakeRoom);
    };
  });

  return `
    <section class="${cx('main-page')}">
      <h1>WebRTC Practice</h1>
      <div>
        <input class="input-box" value="${value()}" placeholder="생성할 방 이름을 입력하세요." />
        <button class="make-btn">방 만들기</button>
      </div>
      <ul class="room-list"></ul>
    </section>
    
  `;
}

export default MainPage;
