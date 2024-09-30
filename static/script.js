
const table = document.getElementById("table-body")
var student_data = []

$("#add-student-form").on("submit", (event) => {
    event.preventDefault()
    createStudent()
})

$("#upload-file-form").on("submit", (event) => {
    event.preventDefault()
    createStudentFromFile(event)
})

function createStudent() {
    let json = {
        list: [{
            exam: document.querySelector("input[name='exam']").value,
            deadline: document.querySelector("input[name='time']").value,
            complition: document.querySelector("input[name='completion']").value,
        }]
    }

    json = JSON.stringify(json)

    $.ajax({
        url: "/makePrediction", contentType: "application/json", method: "post", data: json
    }).then((data) => {
        console.log(data)
        data.forEach((el) => {
            addStudentToTable(el);
            student_data.push(el)
        })

    })
}

async function createStudentFromFile(event) {
    let formData = new FormData();
    formData.append("file", event.target[0].files[0]);
    const res = await fetch('/upload', {
        method: "POST",
        body: formData
    })
    const json = await res.json()
    json.forEach((el) => {

        el.exam*= 100
        el.deadline*= 100
        el.complition*= 100

        addStudentToTable(el);
        student_data.push(el);
    })

}

function addStudentToTable(data) {
    let tr = document.createElement('tr')
    let exam = document.createElement('td')
    let time = document.createElement('td')
    let completion = document.createElement('td')
    let success = document.createElement('td')
    exam.innerHTML = data.exam;
    time.innerHTML = data.deadline;
    completion.innerHTML = data.complition;
    success.innerHTML = data.success.toFixed(2);
    data.success >= 0.8 ? success.className = "bg-success text-white" : success.className = "bg-danger text-white"
    tr.innerHTML = exam.outerHTML + time.outerHTML + completion.outerHTML + success.outerHTML;
    table.innerHTML += tr.outerHTML;
}

function clearTable() {
    table.innerHTML = ""
    student_data = []
}
function downloadJSONAsCSV() {

    let data = []
    student_data.forEach((el)=> {
        el.exam*= 0.01
        el.deadline*=0.01
        el.complition*=0.01

        data.push(el)
    })

   let csvData = jsonToCsv(data); // Add .items.data
            // Create a CSV file and allow the user to download it
            let blob = new Blob([csvData], { type: 'text/csv' });
            let url = window.URL.createObjectURL(blob);
            let a = document.createElement('a');
            a.href = url;
            a.download = 'data.csv';
            document.body.appendChild(a);
            a.click();
}
function jsonToCsv(jsonData) {
    let csv = '';
    // Get the headers
    let headers = Object.keys(jsonData[0]);
    csv += headers.join(',') + '\n';
    // Add the data
    jsonData.forEach(function (row) {
        let data = headers.map(header => JSON.stringify(row[header])).join(','); // Add JSON.stringify statement
        csv += data + '\n';
    });
    return csv;
}