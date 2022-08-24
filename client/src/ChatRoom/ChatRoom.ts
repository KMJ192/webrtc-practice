import { useDocument, useState, useEffect } from '@react';
import { useParam, useRedirection } from '@router';

import classNames from 'classnames/bind';
import style from './ChatRoom.module.scss';
const cx = classNames.bind(style);

function ChatRoom() {
  const { id } = useParam();

  const getMedia = async () => {
    const cam = document.querySelector('.cam-area');
    if (cam === null) return;

    const initialConstraints = {
      audio: true,
      video: {
        facingMode: 'user',
      },
    };

    try {
      const myStream = await navigator.mediaDevices.getUserMedia(
        initialConstraints,
      );

      (cam as HTMLVideoElement).srcObject = myStream;

      const devices: MediaDeviceInfo[] =
        await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(
        (device: MediaDeviceInfo) => device.kind === 'videoinput',
      );
      const currentCamera = myStream.getVideoTracks()[0];
      console.log(currentCamera);
      // cameras.forEach((camera) => {

      // })
    } catch (e) {
      console.log(e);
    }
  };

  // useDocument(() => {
  //   console.log(document.getElementById('test'));
  // });

  useEffect(() => {
    getMedia();
  }, []);

  return `
    <section class="${cx('chatroom-page')}" id="test">
      <h1>chat room ${id}</h1>
      <video class="cam-area"></video>
    </section>
  `;
}

export default ChatRoom;
