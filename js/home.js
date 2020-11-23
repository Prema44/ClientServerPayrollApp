let empPayrollList;

window.addEventListener('DOMContentLoaded', () => {
    
    if(site_properties.use_local_storage.match("true")){
        getEmployeePayrollDataFromStorage();
    }
    getEmployeePayrollDataFromServer();

});

const processEmployeePayrollDataResponse = () => {
    document.querySelector('.emp-count').textContent = empPayrollList.length;
    createInnerHtml();
    localStorage.removeItem('editEmp');
}

const createInnerHtml = () => {
    const headerHtml = `<tr><th></th><th>Name</th><th>Gender</th><th>Department</th><th>Salary</th><th>StartDate</th><th>Actions</th></tr>`;
    let innerHtml = `${headerHtml}`;
    if(empPayrollList.length == 0)
        { document.querySelector('#display').innerHTML = innerHtml; 
          return ; 
        }

    for(const empPayrollData of empPayrollList){
        innerHtml = `${innerHtml}
        <tr> 
            <td><img class = "profile" src = "${empPayrollData._profilePic}"" alt = ""></td>
            <td>${empPayrollData._name}</td>
            <td>${empPayrollData._gender}</td>
            <td>${getDeptHtml(empPayrollData._department)}</td>
            <td>${empPayrollData._salary}</td>
            <td>${stringifyDate(empPayrollData._startDate)}</td>
            <td>
                <img id = "${empPayrollData.id}" src = "../assets/create-black-18dp.svg" onclick = "update(this)" alt = "edit">
                <img id = "${empPayrollData.id}" src = "../assets/delete-black-18dp.svg" onclick = "remove(this)" alt = "delete">
            </td>
        </tr>
    `;
    }
   
    document.querySelector('#display').innerHTML = innerHtml;
};

const getDeptHtml = (deptList) => {
    let deptHtml =``;
    for (const dept of deptList){
        deptHtml = `${deptHtml}<div class = "dept-label">${dept}</div>`;
    }
    return deptHtml;
};

const getEmployeePayrollDataFromStorage = () => {
    empPayrollList = localStorage.getItem('EmployeePayrollList') ? JSON.parse(localStorage.getItem('EmployeePayrollList')) : [];
    processEmployeePayrollDataResponse();
};

const getEmployeePayrollDataFromServer = () => {
    makeServiceCall("GET", site_properties.server_url, true)
        .then(responseText => {
            empPayrollList = JSON.parse(responseText);
            processEmployeePayrollDataResponse();
        })
        .catch(error => {
            console.log("GET Error Status : " + JSON.stringify(error));
            empPayrollList = [];
            processEmployeePayrollDataResponse();
        })
}

const remove = (node) => {
    
    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if( !empPayrollData) return;
    const index = empPayrollList.map(empData => empData.id).indexOf(empPayrollData.id);
    empPayrollList.splice(index, 1);
    if(site_properties.use_local_storage.match("true")){
        localStorage.setItem("EmployeePayrollList", JSON.stringify(empPayrollList));
        document.querySelector(".emp-count").textContent = empPayrollList.length;
        createInnerHtml();
    } else {
        const deleteURL = site_properties.server_url + empPayrollData.id.toString();
        makeServiceCall("DELETE", deleteURL, false)
            .then(responseText => {
                document.querySelector(".emp-count").textContent = empPayrollList.length;
                createInnerHtml();
            })
            .catch(error => {
                console.log("DELETE error status : "+ JSON.stringify(error))
            })
    }  
};

const update = (node) => {

    let empPayrollData = empPayrollList.find(empData => empData.id == node.id);
    if( !empPayrollData) return;
    localStorage.setItem('editEmp', JSON.stringify(empPayrollData));
    window.location.replace(site_properties.add_emp_payroll_page);

};