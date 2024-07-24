document.addEventListener("DOMContentLoaded", function() {
    const patientDataDiv = document.getElementById('patient-data');
    const resourcesDataDiv = document.getElementById('resources-data');

    const patientUrl = "http://hapi.fhir.org/baseR4/Patient/mr-spock";
    const everythingUrl = "http://hapi.fhir.org/baseR4/Patient/mr-spock/$everything";

    // Function to fetch and display patient data
    function fetchPatientData() {
        fetch(patientUrl)
            .then(response => response.json())
            .then(patient => {
                displayPatientData(patient);
                fetchEverythingData();
            })
            .catch(error => console.error('Error fetching patient data:', error));
    }

    // Function to display patient data
    function displayPatientData(patient) {
        const identifier = patient.identifier && patient.identifier[0];
        const idType = identifier ? identifier.type.coding[0].display : 'N/A';
        const idValue = identifier ? identifier.value : 'N/A';

        const patientHtml = `
            <h2>${patient.name[0].given.join(' ')} ${patient.name[0].family}</h2>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Birth Date:</strong> ${patient.birthDate}</p>
            <p><strong>ID Type:</strong> ${idType}</p>
            <p><strong>ID Value:</strong> ${idValue}</p>
        `;
        patientDataDiv.innerHTML = patientHtml;
    }

    // Function to fetch and display associated resources
    function fetchEverythingData() {
        fetch(everythingUrl)
            .then(response => response.json())
            .then(bundle => {
                displayResourcesData(bundle.entry);
            })
            .catch(error => console.error('Error fetching associated resources:', error));
    }

    // Function to display associated resources
    function displayResourcesData(entries) {
        let resourcesHtml = '';
        entries.forEach(entry => {
            const resource = entry.resource;
            resourcesHtml += `
                <div class="resource">
                    <h3>${resource.resourceType}</h3>
                    ${formatResource(resource)}
                </div>
            `;
        });
        resourcesDataDiv.innerHTML = resourcesHtml;
    }

    // Function to format and display different types of resources
    function formatResource(resource) {
        switch (resource.resourceType) {
            case 'Observation':
                return `
                    <table>
                        <tr><th>Field</th><th>Value</th></tr>
                        <tr><td><strong>ID</strong></td><td>${resource.id}</td></tr>
                        <tr><td><strong>Status</strong></td><td>${resource.status}</td></tr>
                        <tr><td><strong>Code</strong></td><td>${resource.code.text}</td></tr>
                        <tr><td><strong>Value</strong></td><td>${resource.valueQuantity ? resource.valueQuantity.value : 'N/A'}</td></tr>
                    </table>
                `;
            case 'Condition':
                return `
                    <table>
                        <tr><th>Field</th><th>Value</th></tr>
                        <tr><td><strong>ID</strong></td><td>${resource.id}</td></tr>
                        <tr><td><strong>Code</strong></td><td>${resource.code.text}</td></tr>
                        <tr><td><strong>Status</strong></td><td>${resource.clinicalStatus}</td></tr>
                    </table>
                `;
            case 'MedicationRequest':
                return `
                    <table>
                        <tr><th>Field</th><th>Value</th></tr>
                        <tr><td><strong>ID</strong></td><td>${resource.id}</td></tr>
                        <tr><td><strong>Status</strong></td><td>${resource.status}</td></tr>
                        <tr><td><strong>Medication</strong></td><td>${resource.medicationCodeableConcept.text}</td></tr>
                    </table>
                `;
            case 'Practitioner':
                return `
                    <table>
                        <tr><th>Field</th><th>Value</th></tr>
                        <tr><td><strong>ID</strong></td><td>${resource.id}</td></tr>
                        <tr><td><strong>Name</strong></td><td>${resource.name ? resource.name[0].text : 'N/A'}</td></tr>
                        <tr><td><strong>Gender</strong></td><td>${resource.gender}</td></tr>
                    </table>
                `;
            case 'Appointment':
                return `
                    <table>
                        <tr><th>Field</th><th>Value</th></tr>
                        <tr><td><strong>ID</strong></td><td>${resource.id}</td></tr>
                        <tr><td><strong>Status</strong></td><td>${resource.status}</td></tr>
                        <tr><td><strong>Start</strong></td><td>${resource.start}</td></tr>
                        <tr><td><strong>End</strong></td><td>${resource.end}</td></tr>
                    </table>
                `;
            case 'Patient':
                return `
                    <table>
                        <tr><th>Field</th><th>Value</th></tr>
                        <tr><td><strong>ID</strong></td><td>${resource.id}</td></tr>
                        <tr><td><strong>Name</strong></td><td>${resource.name ? resource.name[0].text : 'N/A'}</td></tr>
                        <tr><td><strong>Gender</strong></td><td>${resource.gender}</td></tr>
                        <tr><td><strong>Birth Date</strong></td><td>${resource.birthDate}</td></tr>
                    </table>
                `;
            default:
                return `
                    <div><strong>Resource Type:</strong> ${resource.resourceType}</div>
                `;
        }
    }

    // Fetch and display the patient data
    fetchPatientData();
});
