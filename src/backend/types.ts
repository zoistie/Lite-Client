import { IpcMainEvent } from 'electron';

export type OllamaQuestion = {
  model: string;
  query: string;
};

export type AudioMessage = {
  audioBlob: Blob;
}


export interface IpcMainEventExtended extends IpcMainEvent {
  status: string;
}
