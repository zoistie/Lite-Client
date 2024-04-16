import React, { useState } from 'react';
import styled from 'styled-components';
import { WavAudioEncoder } from './WavAudioEncoder';
declare global {
  interface Window {
    sendAudioToMain: {
      send: (audioData: ArrayBuffer) => void;
    };
  }
}

type ButtonWrapperProps = {
  selected: boolean;
};
let mediaRecorder: MediaRecorder | null = null;

const ToggleButton = () => {
  const [selected, setSelected] = useState(false);

  const startRecording = async () => {
    console.log('Recording started');
    const chunks: BlobPart[] = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks);
      const ac = new AudioContext();
      try {
        const buffer = await blob.arrayBuffer();
        const audioBuffer = await ac.decodeAudioData(buffer);
        const wav = new WavAudioEncoder({
          numberOfChannels: audioBuffer.numberOfChannels,
          sampleRate: ac.sampleRate,
        });
        wav.write(audioBuffer);
        const data = await wav.encode();
        await ac.close();

        const audioUrl = URL.createObjectURL(data);
        console.log('Audio URL:', audioUrl);
        console.log('Recording stopped and processed');
        window.sendAudioToMain.send(await data.arrayBuffer());
      } catch (error) {
        console.error('Error converting Blob to buffer:', error);
      }
    };

    mediaRecorder.start();
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      console.log('Recording stopped');
    }
  };

  const handleClick = () => {
    if (!selected) {
      startRecording();
    } else {
      stopRecording();
    }
    setSelected(!selected);
  };

  return (
    <ButtonWrapper onClick={handleClick} selected={selected}>
      {selected ? 'Stop' : 'Record'}
    </ButtonWrapper>
  );
};

const ButtonWrapper = styled.div<ButtonWrapperProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  border-radius: 30px;
  background-color: ${props => props.selected ? 'red' : '#4CAF50'};
  color: white;
  padding: 0 15px;
  cursor: pointer;
  transition: background-color 0.5s;

  &:hover {
    background-color: ${props => props.selected ? '#ff3333' : '#45a049'};
  }
`;

export default ToggleButton;
