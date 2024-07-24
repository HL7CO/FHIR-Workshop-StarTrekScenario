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
        const patientHtml = `
            <h2>${patient.name[0].given.join(' ')} ${patient.name[0].family}</h2>
            <p><strong>Gender:</strong> ${patient.gender}</p>
            <p><strong>Birth Date:</strong> ${patient.birthDate}</p>
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
                    <pre>${JSON.stringify(resource, null, 2)}</pre>
                </div>
            `;
        });
        resourcesDataDiv.innerHTML = resourcesHtml;
    }

    // Fetch and display the patient data
    fetchPatientData();
});
