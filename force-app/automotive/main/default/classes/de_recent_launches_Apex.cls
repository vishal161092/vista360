public with sharing class de_recent_launches_Apex {
    /**
     * Base URL for Experience Cloud (consumer) site — used to resolve relative product image paths.
     */
    private static final String CONSUMER_SITE_BASE_URL = System.Label.Velo_Consumer_Site_Url;

    public class HomeProductRow {
        @AuraEnabled
        public Id id;
        @AuraEnabled
        public String name;
        @AuraEnabled
        public String description;
        @AuraEnabled
        public String imageUrl;
        @AuraEnabled
        public String productBrochureUrl;
        @AuraEnabled
        public String pitch;
    }

    @AuraEnabled(cacheable = true)
    public static List<HomeProductRow> getHomeProducts() {
        List<HomeProductRow> rows = new List<HomeProductRow>();
        for (Product2 p : [
            SELECT Id, Name, Description, Product_Image_URL__c
            FROM Product2
            ORDER BY LastModifiedDate DESC
            LIMIT 100
        ]) {
            HomeProductRow r = new HomeProductRow();
            r.id = p.Id;
            r.name = p.Name;
            r.description = p.Description;
            r.imageUrl = resolveProductImageUrl(p.Product_Image_URL__c);
            r.productBrochureUrl = null;
            r.pitch = null;
            rows.add(r);
        }
        return rows;
    }

    /**
     * Builds a browser-usable image URL: keeps absolute http(s) URLs; for relative paths, prefixes CONSUMER_SITE_BASE_URL
     * so images resolve correctly on Experience Cloud / mobile.
     */
    private static String resolveProductImageUrl(String raw) {
        if (String.isBlank(raw)) {
            return null;
        }
        String s = raw.trim();
        String lower = s.toLowerCase();
        if (lower.startsWith('http://') || lower.startsWith('https://')) {
            return s;
        }
        if (s.startsWith('//')) {
            return 'https:' + s;
        }
        String base = CONSUMER_SITE_BASE_URL;
        while (base.endsWith('/')) {
            base = base.substring(0, base.length() - 1);
        }
        if (s.startsWith('/')) {
            return base + s;
        }
        return base + '/' + s;
    }

    @AuraEnabled
    public static String transcribeAudio(String engData) {

        String extractedMessage = engData;
        system.debug('Message >>>'+engData);
        String endpoint = 'callout:Bhashini_API/services/inference/translation?serviceId=ai4bharat/indictrans-v2-all-gpu--t4';

        Map<String, Object> requestBody = new Map<String, Object>();
        List<Object> inputList = new List<Object>();
        inputList.add(new Map<String, Object>{ 'source' => extractedMessage });
        requestBody.put('input', inputList);
        requestBody.put('config', new Map<String, Object>{
            'language' => new Map<String, String>{ 'sourceLanguage' => 'en', 'targetLanguage' => 'ta' }
        });

        Http http1 = new Http();
        HttpRequest request1 = new HttpRequest();
        request1.setEndpoint(endpoint);
        request1.setMethod('POST');
        // Authorization header is injected by the Bhashini_API Named Credential / External Credential
        request1.setHeader('Content-Type', 'application/json');
        request1.setBody(JSON.serialize(requestBody));
        request1.setTimeout(120000); 

        try {
            system.debug('Trying to fire');
            HttpResponse response1 = http1.send(request1);
            if (response1.getStatusCode() == 200) {
                
                Map<String, Object> responseBody = (Map<String, Object>) JSON.deserializeUntyped(response1.getBody());
                List<Object> outputList = (List<Object>) responseBody.get('output');
                if (outputList != null && !outputList.isEmpty()) {
                    Map<String, Object> outputItem = (Map<String, Object>) outputList[0];
                    system.debug(outputItem.get('target'));
                    return (String) outputItem.get('target'); 
                }
            }
        } catch (Exception e) {
            System.debug('Error calling Bhashini API: ' + e.getMessage());
        }
        return null;
    }

    /**
     * Returns raw base64 WAV payload (no file saved). LWC must play via Blob + blob: URL — Lightning CSP blocks data: for media-src.
     */
    @AuraEnabled
    public static String generateVoiceForPlayback(String inputText) {
        String audioContent = fetchBhashiniTtsAudioBase64(inputText);
        if (String.isBlank(audioContent)) {
            throw new AuraHandledException('No audio returned from TTS service.');
        }
        return audioContent;
    }

    /**
     * Saves WAV to Files and returns org-relative download URL for the ContentDocument.
     */
    @AuraEnabled
    public static String generateVoice(String inputText) {
        String audioContent = fetchBhashiniTtsAudioBase64(inputText);
        if (String.isBlank(audioContent)) {
            throw new AuraHandledException('No audio returned from TTS service.');
        }

        ContentVersion contentVersion = new ContentVersion();
        contentVersion.Title = 'Generated Audio';
        contentVersion.PathOnClient = 'generated_audio.wav';
        contentVersion.VersionData = EncodingUtil.base64Decode(audioContent);
        insert contentVersion;

        ContentVersion insertedContentVersion = [
            SELECT ContentDocumentId
            FROM ContentVersion
            WHERE Id = :contentVersion.Id
            LIMIT 1
        ];

        String base = URL.getOrgDomainUrl().toExternalForm();
        while (base.endsWith('/')) {
            base = base.substring(0, base.length() - 1);
        }
        return base + '/sfc/servlet.shepherd/document/download/' + insertedContentVersion.ContentDocumentId;
    }

    private static String fetchBhashiniTtsAudioBase64(String inputText) {
        if (String.isBlank(inputText)) {
            throw new AuraHandledException('Input text cannot be empty.');
        }

        String endpoint = 'callout:Bhashini_API/services/inference/pipeline';

        Map<String, Object> requestBody = new Map<String, Object>{
            'pipelineTasks' => new List<Object>{
                new Map<String, Object>{
                    'taskType' => 'tts',
                    'config' => new Map<String, Object>{
                        'language' => new Map<String, Object>{ 'sourceLanguage' => 'ta' },
                        'serviceId' => 'ai4bharat/indic-tts-coqui-dravidian-gpu--t4',
                        'gender' => 'female',
                        'samplingRate' => 8000
                    }
                }
            },
            'inputData' => new Map<String, Object>{
                'input' => new List<Object>{
                    new Map<String, Object>{ 'source' => inputText }
                }
            }
        };

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('POST');
        // Authorization header is injected by the Bhashini_API Named Credential / External Credential
        request.setHeader('Content-Type', 'application/json');
        request.setBody(JSON.serialize(requestBody));
        request.setTimeout(120000);

        HttpResponse response = http.send(request);
        if (response.getStatusCode() != 200) {
            throw new AuraHandledException('TTS request failed: HTTP ' + response.getStatusCode());
        }

        Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
        List<Object> pipelineResponse = (List<Object>) responseMap.get('pipelineResponse');
        if (pipelineResponse == null || pipelineResponse.isEmpty()) {
            return null;
        }
        Map<String, Object> firstElement = (Map<String, Object>) pipelineResponse[0];
        List<Object> output = (List<Object>) firstElement.get('audio');
        if (output == null || output.isEmpty()) {
            return null;
        }
        Map<String, Object> outputItem = (Map<String, Object>) output[0];
        return (String) outputItem.get('audioContent');
    }

    @AuraEnabled
    public static String transcribeAgentPitch(String base64Audio) {
        if (String.isBlank(base64Audio)) {
            throw new AuraHandledException('Audio data is required.');
        }

        String endpoint = 'callout:Bhashini_API/services/inference/pipeline';

        Map<String, Object> requestBody = new Map<String, Object>();
        requestBody.put(
            'pipelineTasks',
            new List<Object>{
                new Map<String, Object>{
                    'taskType' => 'asr',
                    'config' => new Map<String, Object>{
                        'language' => new Map<String, String>{ 'sourceLanguage' => 'en' },
                        // 'serviceId' => 'ai4bharat/conformer-hi-gpu--t4',
                        //'serviceId' => 'ai4bharat/conformer-multilingual-dravidian-gpu--t4',
                        'serviceId' => 'ai4bharat/whisper-medium-en--gpu--t4',
                        'audioFormat' => 'webm',
                        'samplingRate' => 16000
                    }
                }
            }
        );
        requestBody.put(
            'inputData',
            new Map<String, Object>{
                'audio' => new List<Object>{ new Map<String, String>{ 'audioContent' => base64Audio } }
            }
        );

        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('POST');
        // Authorization header is injected by the Bhashini_API Named Credential / External Credential
        request.setHeader('Content-Type', 'application/json');
        request.setBody(JSON.serialize(requestBody));
        request.setTimeout(120000); // 2 minutes timeout

        try {
            HttpResponse response = http.send(request);

            if (response.getStatusCode() == 200) {

				String jsonResponse = response.getBody().toString();

				Map<String, Object> responseMap = (Map<String, Object>) JSON.deserializeUntyped(jsonResponse);

				List<Object> pipelineResponse = (List<Object>) responseMap.get('pipelineResponse');
				if (pipelineResponse == null || pipelineResponse.isEmpty()) {
					return null;
				}

				Map<String, Object> firstElement = (Map<String, Object>) pipelineResponse[0];

				List<Object> output = (List<Object>) firstElement.get('output');
				if (output == null || output.isEmpty()) {
					return null;
				}

				Map<String, Object> outputItem = (Map<String, Object>) output[0];

				String sourceContent = (String) outputItem.get('source');

				System.debug('Source Content: ' + sourceContent);

				return sourceContent;

            } else {
                throw new AuraHandledException('ASR error: ' + response.getBody());
            }
        } catch (Exception ex) {
            System.debug('Exception during API Callout: ' + ex.getMessage());
            throw new AuraHandledException('API callout failed: ' + ex.getMessage());
        }
    }

    @AuraEnabled
	public static String salesPitchFeedback(String pitch_Trans, String prodId) {
    try {
        String templateNameOrId = 'Velo_Sales_Pitch_Feedback'; // prompt template API name
                
        System.debug('pitch_Trans >>>>'+pitch_Trans);
        System.debug('prodId >>>>'+prodId);
                
        ConnectApi.EinsteinPromptTemplateGenerationsInput promptInput = new ConnectApi.EinsteinPromptTemplateGenerationsInput();
        promptInput.isPreview = false;

        ConnectApi.EinsteinLlmAdditionalConfigInput config = new ConnectApi.EinsteinLlmAdditionalConfigInput();
        config.applicationName = 'PromptBuilderPreview'; 
        promptInput.additionalConfig = config;

        Map<String, ConnectApi.WrappedValue> inputParams = new Map<String, ConnectApi.WrappedValue>();
        
        ConnectApi.WrappedValue pitchTrans = new ConnectApi.WrappedValue();
        pitchTrans.value = pitch_Trans;
        inputParams.put('Input:pitch_Trans', pitchTrans);

        Map<String, String> prodRecordIdMap = new Map<String, String>();
        prodRecordIdMap.put('Id', prodId);
        ConnectApi.WrappedValue prodWrappedValue = new ConnectApi.WrappedValue();
        prodWrappedValue.value = prodRecordIdMap;
        inputParams.put('Input:prod', prodWrappedValue);

        promptInput.inputParams = inputParams;

        ConnectApi.EinsteinPromptTemplateGenerationsRepresentation response = 
        ConnectApi.EinsteinLLM.generateMessagesForPromptTemplate(templateNameOrId, promptInput);

        System.debug('response >>>>'+response.generations);

        if (response.generations != null && !response.generations.isEmpty()) {
            System.debug('response.generations[0].text >>>>'+response.generations[0].text);
            return response.generations[0].text;
        }
        
        return 'There is some issue with the feedback generation. Please try again.';

    } catch (Exception e) {
        throw new AuraHandledException('Error: ' + e.getMessage());
    }
}
}