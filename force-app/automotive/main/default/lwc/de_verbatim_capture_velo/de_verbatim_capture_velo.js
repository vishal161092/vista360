import VEHICLE_IMAGES from '@salesforce/resourceUrl/veloVehicleImages';
import { LightningElement, track } from 'lwc';
import transcribeAgentPitch from '@salesforce/apex/de_recent_launches_Apex.transcribeAgentPitch';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class DeVerbatimCaptureVelo extends LightningElement {
    @track activeScreen = 'screen1';
    @track customerVerbatim = '';
    @track showVocDetails = false;
    @track vocMapperLoading = false;
    @track isRecording = false;
    @track notesAsrLoading = false;

    _mediaRecorder;
    _recordChunks = [];
    _recordStream;
    _recordMimeType = 'audio/webm';
    _discardRecording = false;
    _vocMapperTimer;

    get isScreen1() {
        return this.activeScreen === 'screen1';
    }

    get isScreen2() {
        return this.activeScreen === 'screen2';
    }

    get isScreen3() {
        return this.activeScreen === 'screen3';
    }

    get micButtonLabel() {
        if (this.notesAsrLoading) {
            return 'Transcribing...';
        }
        return this.isRecording ? 'Stop Mic' : 'Use Mic';
    }

    get micIconName() {
        return this.isRecording ? 'utility:muted' : 'utility:unmuted';
    }

    navigateToScreen2() {
        this.activeScreen = 'screen2';
    }

    navigateToScreen3() {
        this.activeScreen = 'screen3';
    }

    handleVerbatimChange(event) {
        this.customerVerbatim = event.target.value;
    }

    handleVocMapperClick() {
        if (this.vocMapperLoading) {
            return;
        }

        this.showVocDetails = false;
        this.vocMapperLoading = true;
        this._vocMapperTimer = window.setTimeout(() => {
            if (!this.isConnected) {
                return;
            }
            this.vocMapperLoading = false;
            this.showVocDetails = true;
            this._vocMapperTimer = null;
        }, 4500);
    }

    disconnectedCallback() {
        this.stopRecordingInternal(true);
        if (this._vocMapperTimer) {
            window.clearTimeout(this._vocMapperTimer);
            this._vocMapperTimer = null;
        }
    }

    async handleMicClick() {
        if (this.notesAsrLoading) {
            return;
        }

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
            this.customerVerbatim = '';
            const MR = window.MediaRecorder;
            if (!MR) {
                stream.getTracks().forEach((track) => track.stop());
                throw new Error('MediaRecorder not available');
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

            this._mediaRecorder.ondataavailable = (event) => {
                if (event.data && event.data.size > 0) {
                    this._recordChunks.push(event.data);
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
                this._recordStream.getTracks().forEach((track) => track.stop());
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
            this._recordStream.getTracks().forEach((track) => track.stop());
            this._recordStream = null;
        }

        this._recordChunks = [];
        this.isRecording = false;
        this._discardRecording = false;
    }

    convertToBase64(audioBlob) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result;
            if (typeof result !== 'string' || !result.includes(',')) {
                this.notesAsrLoading = false;
                this.showToast('Recording', 'Could not encode audio.', 'error');
                return;
            }
            const base64Data = result.split(',')[1];
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
                this.customerVerbatim = text;
            }
        } catch (error) {
            const message = error?.body?.message || error?.message || 'Transcription failed';
            this.showToast('Transcription', message, 'error');
        } finally {
            this.notesAsrLoading = false;
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

    get vx700ImageUrl() {
        return `${VEHICLE_IMAGES}/vx700.png`;
    }

    get trailhawkImageUrl() {
        return `${VEHICLE_IMAGES}/trailhawkRx.png`;
    }
}
