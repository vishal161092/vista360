import { LightningElement, api } from 'lwc';
import { FlowNavigationFinishEvent } from 'lightning/flowSupport';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveVisitNotes from '@salesforce/apex/de_capture_visit_notes_Apex.saveVisitNotes';
import transcribeAgentPitch from '@salesforce/apex/de_recent_launches_Apex.transcribeAgentPitch';

/** Voice capture: same MediaRecorder + transcribeAgentPitch pattern as de_key_tasks_Opp (no changes to that LWC or its Apex). */
export default class De_capture_visit_notes extends LightningElement {
    @api visitId;
    @api recordId;

    notesValue = '';
    saving = false;
    isRecording = false;
    notesAsrLoading = false;
    _mediaRecorder;
    _recordChunks = [];
    _recordStream;
    _recordMimeType = 'audio/webm';
    _discardRecording = false;

    disconnectedCallback() {
        this.stopRecordingInternal(true);
    }

    /** Prefer visitId; else recordId (legacy Flow input). */
    get effectiveVisitId() {
        const fromVisit = this.trimId(this.visitId);
        if (fromVisit) return fromVisit;
        return this.trimId(this.recordId);
    }

    trimId(value) {
        if (value == null) return null;
        const s = String(value).trim();
        return s.length >= 15 ? s : null;
    }

    get showVisitIdWarning() {
        return !this.effectiveVisitId;
    }

    get saveDisabled() {
        return !this.effectiveVisitId || this.saving || this.isRecording || this.notesAsrLoading;
    }

    get recordVoiceDisabled() {
        return this.saving || this.notesAsrLoading;
    }

    get recordVoiceTitle() {
        return this.isRecording ? 'Stop recording' : 'Record voice';
    }

    get voiceControlTabindex() {
        return this.recordVoiceDisabled ? '-1' : '0';
    }

    get voiceControlClass() {
        const parts = ['cvn-notes-voice-control'];
        if (this.isRecording) {
            parts.push('cvn-notes-voice-control--recording');
        }
        if (this.recordVoiceDisabled) {
            parts.push('cvn-notes-voice-control--disabled');
        }
        return parts.join(' ');
    }

    handleNotesChange(event) {
        this.notesValue = event.target.value;
    }

    handleVoiceControlClick(event) {
        if (this.recordVoiceDisabled) {
            event.preventDefault();
            return;
        }
        this.toggleRecord();
    }

    handleVoiceControlKeydown(event) {
        if (this.recordVoiceDisabled) {
            return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            this.toggleRecord();
        }
    }

    async toggleRecord() {
        if (this.isRecording) {
            if (this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
                try {
                    this._mediaRecorder.requestData();
                } catch {
                    /* ignore */
                }
                this._mediaRecorder.stop();
            }
            return;
        }
        if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
            this.showToast('Microphone', 'Recording is not supported in this browser or context.', 'warning');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this._recordStream = stream;
            this._recordChunks = [];
            const MR = window.MediaRecorder;
            if (!MR) {
                stream.getTracks().forEach((t) => t.stop());
                throw new Error('no MediaRecorder');
            }
            const preferred = 'audio/webm;codecs=opus';
            const mimeType = MR.isTypeSupported(preferred)
                ? preferred
                : MR.isTypeSupported('audio/webm')
                  ? 'audio/webm'
                  : '';
            this._recordMimeType = mimeType || 'audio/webm';
            const options = mimeType ? { mimeType } : {};
            this._mediaRecorder = new MR(stream, options);
            this._discardRecording = false;
            this._mediaRecorder.ondataavailable = (e) => {
                if (e.data && e.data.size > 0) {
                    this._recordChunks.push(e.data);
                }
            };
            this._mediaRecorder.onstop = () => {
                this.handleRecordStop();
            };
            this._mediaRecorder.start(250);
            this.isRecording = true;
        } catch {
            this.showToast('Microphone', 'Could not access the microphone.', 'error');
        }
    }

    handleRecordStop() {
        if (this._recordStream) {
            try {
                this._recordStream.getTracks().forEach((t) => t.stop());
            } catch {
                /* ignore */
            }
            this._recordStream = null;
        }

        const discard = this._discardRecording;
        this._discardRecording = false;
        this.isRecording = false;
        this._mediaRecorder = null;

        if (discard) {
            this._recordChunks = [];
            return;
        }

        const blob = new Blob(this._recordChunks, { type: this._recordMimeType || 'audio/webm' });
        this._recordChunks = [];

        if (!blob.size) {
            this.showToast('Recording', 'No audio captured. Try again.', 'warning');
            return;
        }

        this.notesAsrLoading = true;
        this.convertToBase64(blob);
    }

    stopRecordingInternal(discard) {
        if (discard) {
            this._discardRecording = true;
        }
        if (this._mediaRecorder && this._mediaRecorder.state !== 'inactive') {
            try {
                this._mediaRecorder.requestData();
            } catch {
                /* ignore */
            }
            try {
                this._mediaRecorder.stop();
            } catch {
                /* ignore */
            }
            return;
        }
        if (this._recordStream) {
            this._recordStream.getTracks().forEach((t) => t.stop());
            this._recordStream = null;
        }
        this._recordChunks = [];
        this.isRecording = false;
        this._discardRecording = false;
    }

    convertToBase64(audioBlob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const res = reader.result;
            if (typeof res !== 'string' || !res.includes(',')) {
                this.notesAsrLoading = false;
                this.showToast('Recording', 'Could not encode audio.', 'error');
                return;
            }
            const base64Data = res.split(',')[1];
            this.callAsr(base64Data);
        };
        reader.onerror = () => {
            this.notesAsrLoading = false;
            this.showToast('Recording', 'Could not read audio data.', 'error');
        };
        reader.readAsDataURL(audioBlob);
    }

    async callAsr(base64Audio) {
        try {
            const result = await transcribeAgentPitch({ base64Audio });
            if (!this.isConnected) {
                return;
            }
            const text = result != null ? String(result).trim() : '';
            if (!text) {
                this.showToast('Transcription', 'No text returned from speech recognition.', 'warning');
            } else {
                const prev = (this.notesValue || '').trim();
                this.notesValue = prev ? `${prev}\n${text}` : text;
            }
        } catch (error) {
            const msg = error?.body?.message || error?.message || 'Transcription failed';
            this.showToast('Transcription', msg, 'error');
        } finally {
            this.notesAsrLoading = false;
        }
    }

    async handleSave() {
        const vid = this.effectiveVisitId;
        if (!vid) return;
        this.saving = true;
        try {
            await saveVisitNotes({ visitId: vid, notes: this.notesValue || '' });
            this.showToast('Saved', 'Visit notes were saved.', 'success');
            window.setTimeout(() => {
                this.dispatchEvent(new FlowNavigationFinishEvent());
            }, 400);
        } catch (error) {
            const msg = error?.body?.message || error?.message || 'Save failed';
            this.showToast('Error', msg, 'error');
        } finally {
            this.saving = false;
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(
            new ShowToastEvent({
                title,
                message,
                variant
            })
        );
    }
}