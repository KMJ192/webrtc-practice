import { io } from 'socket.io-client';

import { useState, useStateNoRender, useDocument } from '@react';
import { useRedirection } from '@router';

import classNames from 'classnames/bind';
import style from './MainPage.module.scss';
const cx = classNames.bind(style);

const socket = io('http://localhost:8080', {
  path: '/socket.io',
  transports: ['websocket'],
});

function MainPage() {
  const [value, setValue] = useStateNoRender('');

  const onChange = (e: Event) => {
    const { value: val } = e.target as HTMLInputElement;
    setValue(val);
  };

  const enterToChatRoom = (e: Event) => {
    useRedirection(`chat-room/${value()}`);
    e.preventDefault();
  };

  useDocument(() => {
    const form = document.querySelector('.form');
    const input = form?.querySelector('input');

    form?.addEventListener('submit', enterToChatRoom);
    input?.addEventListener('input', onChange);

    return () => {
      form?.addEventListener('submit', enterToChatRoom);
      input?.removeEventListener('input', onChange);
    };
  });

  return `
    <section class="${cx('main-page')}">
      <h1>WebRTC Practice</h1>
      <form class="${cx('make-container')} form">
        <input value="${value()}" placeholder="생성할 방 이름을 입력하세요." />
        <button>방 만들기</button>
      </form>
      <ul class="room-list"></ul>
    </section>
    
  `;
}

export default MainPage;
