const docusign = require('docusign-esign');
const path = require('path');
const validPath = path.join(__dirname, 'Resume.pdf').toString();
async function sendEnvelope(accessToken, accountId, signerEmail, signerName) {
    const apiClient = new docusign.ApiClient();
    apiClient.setBasePath('https://demo.docusign.net/restapi');
    apiClient.addDefaultHeader('Authorization', `Bearer ${accessToken}`);
    
    const envelopesApi = new docusign.EnvelopesApi(apiClient);

    // Create the envelope definition
    const envelopeDefinition = new docusign.EnvelopeDefinition();
    envelopeDefinition.emailSubject = 'Please sign this document';
    envelopeDefinition.emailBlurb = 'Document signing request';

    // Read document and convert it to Base64
    const fs = require('fs');
    const documentBytes = fs.readFileSync(validPath);
    const base64Doc = Buffer.from(documentBytes).toString('base64');
    
    // Document object
    const doc = new docusign.Document();
    doc.documentBase64 = base64Doc;
    doc.name = 'Sample Document';
    doc.fileExtension = 'pdf';
    doc.documentId = '1';

    // Add the document to the envelope
    envelopeDefinition.documents = [doc];

    // Signer and verification setup
    const signer = docusign.Signer.constructFromObject({
        email: signerEmail,
        name: signerName,
        recipientId: '1',
        routingOrder: '1',
        authenticationMethod: 'email',
        smsAuthentication: {
            senderProvidedNumbers: ['+1234567890'] // SMS verification
        }
    });

    // SignHere tab (where the signature will appear)
    const signHere = docusign.SignHere.constructFromObject({
        anchorString: '/sig/',
        anchorUnits: 'pixels',
        anchorYOffset: '10',
        anchorXOffset: '20'
    });

    signer.tabs = docusign.Tabs.constructFromObject({ signHereTabs: [signHere] });
    envelopeDefinition.recipients = docusign.Recipients.constructFromObject({ signers: [signer] });
    envelopeDefinition.status = 'sent';  // Send the envelope by setting status to "sent"

    // Send the envelope
    const results = await envelopesApi.createEnvelope(accountId, { envelopeDefinition });
    console.log('Envelope has been sent! Envelope ID:', results.envelopeId);
    return results;
}

const token = 'OGUzNzVjM2I2MTVjNjE1Mjg1ZWNjMjUzZDcwMjFhN2I6ZDM5ZTRiMmE1MDFjMjgyNDM2MzI5MTZmODY1NGQ1YjE=';
const applicationId = '86cff27498004f6fb00a5c91ff8c725a562a359b';
const clientId = '9c8b6b587f123d34a879fd35eacbd356';
const secretId = 'be3cc6a9afdb1803148292b2c88959ef';
const signerEmail = 'shailesh.kumar@sapdeinfotech.net';

// const validPath = path.join(__dirname, 'Resume.pdf').toString();
// console.log('valid path', validPath);
// const documentPath = './Resume.pdf';
sendEnvelope(token, applicationId, signerEmail);