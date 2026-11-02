import { LightningElement, wire } from 'lwc';
import uploadFile from '@salesforce/apex/de_fileUploadController.uploadFile';
import getCaseNumber from '@salesforce/apex/de_fileUploadController.getCaseNumber';

const MAX_FILES = 4;
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default class De_fileUpload_velo extends LightningElement {
    caseId;
    caseNumber;
    files = [];
    isUploading = false;
    uploadComplete = false;
    errorMessage;
    successMessage;

    connectedCallback() {
        this.caseId = this.getUrlParam('id');
        if (!this.caseId) {
            this.errorMessage = 'No Case ID found in the URL.';
        }
    }

    @wire(getCaseNumber, { caseId: '$caseId' })
    wiredCase({ data, error }) {
        if (data) {
            this.caseNumber = data;
        } else if (error) {
            this.errorMessage = 'Unable to load case details. The link may be invalid.';
        }
    }

    get acceptedFormats() {
        return '.jpg,.jpeg,.png,.pdf,.doc,.docx';
    }

    get hasFiles() {
        return this.files.length > 0;
    }

    get canAddMore() {
        return this.files.length < MAX_FILES;
    }

    get filesRemaining() {
        return MAX_FILES - this.files.length;
    }

    get uploadDisabled() {
        return this.files.length === 0 || this.isUploading;
    }

    get showFileInput() {
        return !this.uploadComplete && this.caseId && !this.errorMessage;
    }

    handleFileChange(event) {
        const inputFiles = Array.from(event.target.files);
        this.errorMessage = undefined;

        for (const file of inputFiles) {
            if (this.files.length >= MAX_FILES) {
                this.errorMessage = `Maximum ${MAX_FILES} files allowed.`;
                break;
            }
            if (file.size > MAX_FILE_SIZE_BYTES) {
                this.errorMessage = `"${file.name}" exceeds ${MAX_FILE_SIZE_MB}MB limit.`;
                continue;
            }
            this.files = [...this.files, { name: file.name, size: this.formatSize(file.size), file, id: Date.now() + '_' + file.name }];
        }

        event.target.value = '';
    }

    handleRemoveFile(event) {
        const fileId = event.currentTarget.dataset.id;
        this.files = this.files.filter(f => f.id !== fileId);
    }

    async handleUpload() {
        if (this.files.length === 0) return;

        this.isUploading = true;
        this.errorMessage = undefined;
        let uploadedCount = 0;

        try {
            for (const fileItem of this.files) {
                const base64 = await this.readFileAsBase64(fileItem.file);
                await uploadFile({
                    caseId: this.caseId,
                    fileName: fileItem.name,
                    base64Data: base64
                });
                uploadedCount++;
            }
            this.uploadComplete = true;
            this.successMessage = `${uploadedCount} file(s) uploaded successfully against Case #${this.caseNumber || this.caseId}.`;
            this.files = [];
        } catch (error) {
            this.errorMessage = error.body ? error.body.message : 'An error occurred during upload.';
        } finally {
            this.isUploading = false;
        }
    }

    readFileAsBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = () => reject(new Error('Failed to read file.'));
            reader.readAsDataURL(file);
        });
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    getUrlParam(param) {
        const url = new URL(window.location.href);
        return url.searchParams.get(param);
    }
}
