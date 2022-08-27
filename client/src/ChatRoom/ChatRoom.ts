import { useDocument, useState, useEffect } from '@react';
import { useParam, useRedirection } from '@router';

import classNames from 'classnames/bind';
import style from './ChatRoom.module.scss';
const cx = classNames.bind(style);

function ChatRoom() {
  const [isDisable, setIsDisable] = useState({
    video: '카메라 끄기',
    audio: '소리 끄기',
  });
  const [mediaStream, setMediaStream] = useState(null);
  const { id } = useParam();

  const getMedia = async () => {
    if (!mediaStream) return;
    const cam = document.querySelector('.cam-area');
    if (cam === null) return;
    const camOptions = document.querySelector('.cam-options');

    try {
      (cam as HTMLVideoElement).srcObject = mediaStream;

      const devices: MediaDeviceInfo[] =
        await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter(
        (device: MediaDeviceInfo) => device.kind === 'videoinput',
      );
      const currentCamera = mediaStream.getVideoTracks()[0];

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

  const mediaHandler = (isVideo: boolean) => {
    if (isVideo) {
      const isCloseVideo = isDisable.video === '카메라 끄기';
      (mediaStream as MediaStream)
        .getVideoTracks()
        .forEach((track: MediaStreamTrack) => (track.enabled = !track.enabled));
      setIsDisable({
        ...isDisable,
        video: isCloseVideo ? '카메라 켜기' : '카메라 끄기',
      });
    } else {
      const isCloseAudio = isDisable.audio === '소리 켜기';
      (mediaStream as MediaStream)
        .getAudioTracks()
        .forEach((track: MediaStreamTrack) => (track.enabled = !track.enabled));
      setIsDisable({
        ...isDisable,
        audio: isCloseAudio ? '소리 끄기' : '소리 켜기',
      });
    }
  };

  const onClickCameraBtn = () => {
    mediaHandler(true);
  };

  const onClickMuteBtn = () => {
    mediaHandler(false);
  };

  useDocument(() => {
    if (mediaStream === null) return;
    getMedia();
  });

  useDocument(() => {
    const camBtn = document.querySelector('.cam-btn');
    const muteBtn = document.querySelector('.mute-btn');

    camBtn?.addEventListener('click', onClickCameraBtn);
    muteBtn?.addEventListener('click', onClickMuteBtn);

    return () => {
      camBtn?.removeEventListener('click', onClickCameraBtn);
      muteBtn?.removeEventListener('click', onClickMuteBtn);
    };
  });

  useEffect(async () => {
    const initialConstraints = {
      audio: true,
      video: {
        facingMode: 'user',
      },
    };
    setMediaStream(
      await navigator.mediaDevices.getUserMedia(initialConstraints),
    );
  }, [mediaStream]);

  return `
    <section class="${cx('chatroom-page')}" id="test">
      <h1>chat room ${id}</h1>
      <video autoplay class="cam-area"></video>
      <select class="cam-options"></select>
      <button class="cam-btn">${isDisable.video}</button>
      <button class="mute-btn">${isDisable.audio}</button>
    </section>
  `;
}

export default ChatRoom;
