import { useDocument, useState, useEffect } from '@react';
import { useParam } from '@router';
import { socket } from '@src/webRTCConnection';

import classNames from 'classnames/bind';
import style from './ChatRoom.module.scss';
const cx = classNames.bind(style);

const peerConnection = new RTCPeerConnection();

function ChatRoom() {
  const [isDisable, setIsDisable] = useState({
    video: '카메라 끄기',
    audio: '소리 끄기',
  });
  const [mediaStream, setMediaStream] = useState(null);
  const [addedTracks, setAddedTracks] = useState(false);
  const [mount, setMount] = useState(false);
  const { id: roomName } = useParam();

  /**
   * 디바이스의 미디어 탐색
   */
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

  /**
   * media 설정 (카메라 / 소리 켜기, 끄기)
   * @param isVideo
   */
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

  /**
   * 카메라 켜기 끄기
   */
  const onClickCameraBtn = () => {
    mediaHandler(true);
  };

  /**
   * 소리 켜기 끄기
   */
  const onClickMuteBtn = () => {
    mediaHandler(false);
  };

  /**
   * 뒤로 가기
   */
  const goBack = () => {
    window.history.back();
  };

  /**
   * ice
   * @param data
   */
  const handleIce = (data: RTCPeerConnectionIceEvent) => {
    socket.emit('ice', data.candidate, roomName);
  };

  const handleAddStream = (data: any) => {
    const peerStream: HTMLVideoElement | null =
      document.querySelector('.peer-stream');
    if (peerStream) {
      peerStream.srcObject = data.stream;
    }
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

  useDocument(() => {
    const backBtn = document.querySelector('.back-btn');
    backBtn?.addEventListener('click', goBack);

    return () => {
      backBtn?.removeEventListener('click', goBack);
    };
  });

  // WebRTC Peer Connection 생성
  useDocument(() => {
    if (mediaStream && !addedTracks) {
      peerConnection.addEventListener('icecandidate', handleIce);
      peerConnection.addEventListener('addstream', handleAddStream);
      (mediaStream as MediaStream)
        .getTracks()
        .forEach((track) => peerConnection.addTrack(track, mediaStream));
      setAddedTracks(true);
      return () => {
        peerConnection.removeEventListener('icecandidate', handleIce);
        peerConnection.removeEventListener('addstream', handleAddStream);
      };
    }
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

  useEffect(() => {
    if (addedTracks && !mount) {
      setMount(true);
      socket.on('welcome', async () => {
        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);
        socket.emit('offer', offer, roomName);
        console.log('send the offer');
      });
    }
  }, []);

  return `
    <section class="${cx('chatroom-page')}" id="test">
      <h1>chat room [${roomName}]</h1>
      <video autoplay class="cam-area"></video>
      <select class="cam-options"></select>
      <button class="cam-btn">${isDisable.video}</button>
      <button class="mute-btn">${isDisable.audio}</button>
      <button class="back-btn">뒤로가기</button>
      <video autoplay class="peer-stream"></video>
    </section>
  `;
}

export default ChatRoom;
