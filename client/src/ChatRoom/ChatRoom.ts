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
    const camOptions = document.querySelector('.cam-options');

    const initialConstraints = {
      audio: false,
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

      cameras.forEach((camera) => {
        const option = document.createElement('option');
        option.value = camera.deviceId;
        option.innerText = camera.label;
        if (currentCamera.label === camera.label) {
          option.selected = true;
        }
        camOptions?.appendChild(option);
      });
    } catch (e) {
      console.log(e);
    }
  };

  useDocument(() => {
    getMedia();
  });

  return `
    <section class="${cx('chatroom-page')}" id="test">
      <h1>chat room ${id}</h1>
      <video autoplay class="cam-area"></video>
      <select class="cam-options"></select>
    </section>
  `;
}

export default ChatRoom;
