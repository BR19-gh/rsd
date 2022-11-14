//tempDB

// const studentInfo = {
//     "0": {
//         id: "1",
//         name: "إبراهيم الخويطر",
//         partsTotal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
//     },
//     "1": {
//         id: "2",
//         name: "فلان الفلاني",
//         partsTotal: [29, 30]
//     },
//     "2": {
//         id: "3",
//         name: "حسام الفايزي",
//         partsTotal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
//     },
//     "3": {
//         id: "4",
//         name: "عبدالرحمن الخزيم",
//         partsTotal: [22, 23, 24, 25, 26, 27, 28, 29, 30, 3, 1, 6, 2]
//     },
//     "5": {
//         id: "5",
//         name: "علان العلاني",
//         partsTotal: [30]
//     },
// }


let listOfStudents;

const parts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

parts.forEach(part => {
    document.querySelector("#partsCheckboxs").innerHTML += `
                <div class="checkboxContainer form-check form-check-inline">
                    <input class="checkboxLabel form-check-input" type="checkbox" id="checkboxPart-${part}" value="${part}">
                    <label class="checkboxLabel form-check-label" ">الجزء ${part}</label>
                            </div>
                        `;
});


// how to spell جزءs
const جزء = (num, list) => {
    if (num == 1 && list == 0) return `لم يحفظ`;
    else if (num == 1 && list != 0) return `جزء واحد`;
    else if (num > 10) return `${num} جزء`;
    else if (num == 2) return "جزءان";
    else return `${num} أجزاء`;
}

const setListOfStudents = (responseJson) => {
    listOfStudents = responseJson;
}

const countPartsMemo = (id) => {
    let finalResult = [];
    parts.forEach(part => {
        if (document.querySelector(`#checkboxPart-${part}`).checked == true) {
            finalResult.push(part);
        }
    });
    console.log(finalResult)
    return finalResult;
}

fetchStudents();

function fetchStudents() {
    fetch("/students", {
            headers: {
                Method: "GET",
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            method: "GET"
        })
        .then((response) => {
            return response.json();
        })
        .then((responseJson) => {
            console.log(responseJson);
            if (responseJson.statCode == 204) {
                let tbody = document.querySelector("tbody");
                tbody.innerHTML = "حدث وانتظر قليلا إذا كنت قد أضفت";
                console.log(204)
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-info"
                );
                return;
            }

            let studentInfo = responseJson;
            setListOfStudents(responseJson)
            let tbody = document.querySelector("tbody");
            let numsOfStudents = Object.keys(studentInfo);
            tbody.innerHTML = '';
            numsOfStudents.forEach(numOfStudent => {

                tbody.innerHTML +=
                    `
                <tr>
                    <td>${studentInfo[numOfStudent].id}</td>
                    <td>${studentInfo[numOfStudent].name}</td>
                    <td>${جزء(studentInfo[numOfStudent].partsTotal.length,studentInfo[numOfStudent].partsTotal)}</td>
                    <td>
                        <div data-bs-toggle="modal" data-bs-target="#studentModal" title="تعديل" onclick="deleteOrEditstudent(${numOfStudent}, 'edit')"> 
                            <i class="icon fas fa-edit"></i> 
                        </div>
                        <div data-bs-toggle="modal" data-bs-target="#studentModal" title="حذف" onclick="deleteOrEditstudent(${numOfStudent}, 'delete')"> 
                            <i class="icon fas fa-trash-alt"></i> 
                        </div> 
                    </td>                      
                </tr>
        `;

            });


        })
        .catch((error) => {
            alert(
                `توجد مشكلة في التواصل مع السيرفر،\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrMsg: ${error}\n ErrCode: 514\n err-fetch-info: students\n التاريخ: ${formatTheDate(
                    new Date(), 1
                )}`
            );
        });
}


document.querySelector("#addstudent").addEventListener("click", () => {

    if (
        document.querySelector("#studentID").value == "" ||
        document.querySelector("#studentName").value == ""
    ) {
        alert("يجب ملئ جميع الخانات أولا");
        setTimeout(() => {
            $("#studentModal").modal("show");
        }, 200);
        return;
    }
    fetch("/student", {
            headers: {
                id: encodeURIComponent(document.querySelector("#studentID").value),
                name: encodeURIComponent(
                    document.querySelector("#studentName").value
                ),
                partsTotal: encodeURIComponent(
                    countPartsMemo(document.querySelector("#studentID").value)
                ),
            },
            method: "POST",
        })
        .then((response) => {
            return response.json();
        })
        .then((responseJson) => {
            if (responseJson.statCode == 403) {
                alert(
                    "الرقم التعريفي للطالب المراد إضافته موجود مسبقا\nالرجاء المحاولة مجددًا باستخدام رقم آخر. \n\n ErrCode: 403-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 400) {
                alert(
                    "هناك مدخلات أُدخلت بشكل خاطئ\nالرقم التعريفي أُدخل فيه نص، يجب إدخاله على شكل رقم فقط. \n\n ErrCode: 400-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 500) {
                alert(
                    "حدث خطأ من طرف السيرفر\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrCode: 530-info"
                ) | $("#studentModal").modal("show");
                return;
            }

            alert(
                `تم إضافة معلومات الطالب رقم ${document.querySelector("#studentID").value} بنجاح، إنتظر قليلا وستظهر التحديثات`
            );
            fetchStudents()
            document.querySelector("#studentID").value = "";
            document.querySelector("#studentName").value = "";
            parts.forEach(part => {
                document.querySelector(`#checkboxPart-${part}`).checked = false;
            });
        })
        .catch((error) => {
            alert(
                `توجد مشكلة في التواصل مع السيرفر،\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrMsg: ${error}\n ErrCode: 516\n err-fetch-info: student\n التاريخ: ${formatTheDate(
                    new Date(), 1
                )}`
            );
        });
});

document.querySelector("#updstudent").addEventListener("click", () => {
    if (
        document.querySelector("#studentName").value == ""
    ) {
        alert("يجب ملئ جميع الخانات أولا");
        setTimeout(() => {
            $("#studentModal").modal("show");
        }, 200);
        return;
    }
    fetch(`/student/${document.querySelector("#studentID").value}`, {
            headers: {
                name: encodeURIComponent(
                    document.querySelector("#studentName").value
                ),
                partsTotal: encodeURIComponent(
                    countPartsMemo(document.querySelector("#studentID").value)
                ),
            },
            method: "PUT"

        })
        .then((response) => {
            return response.json();
        })
        .then((responseJson) => {
            if (responseJson.statCode == 404) {
                alert(
                    "الرقم التعريفي للطالب المراد تحديثه غير موجود\nالرجاء المحاولة مجددًا باستخدام رقم آخر. \n\n ErrCode: 404-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 400) {
                alert(
                    "هناك مدخلات أُدخلت بشكل خاطئ\nالرقم التعريفي أُدخل فيه نص، يجب إدخاله على شكل رقم فقط. \n\n ErrCode: 400-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 500) {
                alert(
                    "حدث خطأ من طرف السيرفر\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrCode: 531-info"
                ) | $("#studentModal").modal("show");
                return;
            }

            alert(
                `تم تعديل معلومات الطالب رقم ${document.querySelector("#studentID").value} بنجاح، إنتظر قليلا وستظهر التحديثات`
            );
            fetchStudents()
            document.querySelector("#studentID").value = "";
            document.querySelector("#studentName").value = "";
            parts.forEach(part => {
                document.querySelector(`#checkboxPart-${part}`).checked = false;
            });
        })
        .catch((error) => {
            alert(
                `توجد مشكلة في التواصل مع السيرفر،\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrMsg: ${error}\n ErrCode: 517\n err-fetch-info: student\n التاريخ: ${formatTheDate(
                    new Date(), 1
                )}`
            );
        });
});


document.querySelector("#delstudent").addEventListener("click", () => {
    fetch(`/student/${document.querySelector("#studentID").value}`, {
            headers: {
                Method: "DELETE",
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            method: "DELETE"
        })
        .then((response) => {
            return response.json();
        })
        .then((responseJson) => {
            if (responseJson.statCode == 404) {
                alert(
                    "الرقم التعريفي للطالب المراد حذفه غير موجود\nالرجاء المحاولة مجددًا باستخدام رقم آخر. \n\n ErrCode: 404-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 400) {
                alert(
                    "هناك مدخلات أُدخلت بشكل خاطئ\nالرقم التعريفي أُدخل فيه نص، يجب إدخاله على شكل رقم فقط. \n\n ErrCode: 400-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-info"
                ) | $("#studentModal").modal("show");
                return;
            }
            if (responseJson.statCode == 500) {
                alert(
                    "حدث خطأ من طرف السيرفر\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrCode: 532-info"
                ) | $("#studentModal").modal("show");
                return;
            }

            alert(`تم حذف معلومات الطالب رقم ${document.querySelector("#studentID").value} بنجاح، إنتظر قليلا وستظهر التحديثات`);
            fetchStudents()
            document.querySelector("#studentID").value = "";
            document.querySelector("#studentName").value = "";
            parts.forEach(part => {
                document.querySelector(`#checkboxPart-${part}`).checked = false;
            });
        });
});




const deleteOrEditstudent = (id, opration) => {
    let studentInfo = listOfStudents;
    (parts).forEach(part => {
        document.querySelector(`#checkboxPart-${part}`).checked = false;
    });

    if (opration == "edit") {

        if (studentInfo[id].partsTotal != 0) {
            (studentInfo[id].partsTotal).forEach(part => {
                document.querySelector(`#checkboxPart-${part}`).checked = true;
            });
        }

        // show btn
        document.querySelector("#addstudent").style.display = "none";
        document.querySelector("#updstudent").style.display = "block";
        document.querySelector("#delstudent").style.display = "none";
        // fill input
        document.querySelector(
            "#studentModalLongTitle"
        ).innerHTML = `تعديل الطالب رقم ${studentInfo[id].id}`;
        document.querySelector("#studentID").value = `${studentInfo[id].id}`;
        document.querySelector("#studentName").value = `${studentInfo[id].name}`;
        // disable input
        document.querySelector("#studentID").disabled = true;
        document.querySelector("#studentName").disabled = false;
        (parts).forEach(part => {
            document.querySelector(`#checkboxPart-${part}`).disabled = false;
        });
    } else if (opration == "delete") {

        if (studentInfo[id].partsTotal != 0) {
            (studentInfo[id].partsTotal).forEach(part => {
                document.querySelector(`#checkboxPart-${part}`).checked = true;
            });
        }

        // show btn
        document.querySelector("#addstudent").style.display = "none";
        document.querySelector("#updstudent").style.display = "none";
        document.querySelector("#delstudent").style.display = "block";
        // fill input
        document.querySelector(
            "#studentModalLongTitle"
        ).innerHTML = `هل أنت متأكد من حذف الطالب رقم ${studentInfo[id].id}؟`;
        document.querySelector("#studentID").value = `${studentInfo[id].id}`;
        document.querySelector("#studentName").value = `${studentInfo[id].name}`;
        // disable input
        document.querySelector("#studentID").disabled = true;
        document.querySelector("#studentName").disabled = true;
        (parts).forEach(part => {
            document.querySelector(`#checkboxPart-${part}`).disabled = true;
        });
    } else if (opration == "add") {
        // show btn
        document.querySelector("#addstudent").style.display = "block";
        document.querySelector("#updstudent").style.display = "none";
        document.querySelector("#delstudent").style.display = "none";
        // fill input
        document.querySelector(
            "#studentModalLongTitle"
        ).innerHTML = `إضافة طالب`;
        document.querySelector("#studentID").value = ``;
        document.querySelector("#studentName").value = ``;
        (parts).forEach(part => {
            document.querySelector(`#checkboxPart-${part}`).checked = false;
        });
        // disable input
        document.querySelector("#studentID").disabled = false;
        document.querySelector("#studentName").disabled = false;
        (parts).forEach(part => {
            document.querySelector(`#checkboxPart-${part}`).disabled = false;
        });
    } else {
        alert(
            "هناك خطأ ما،  تواصل مع المطور لحل المشكلة. \n\n ErrCode: 558-info"
        );
    }
}
















function formatTheDate(date, typeOfFormat) {
    let hours12 = date.getHours();
    let hours24 = hours12;
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    const ampm = hours12 >= 12 ? "م" : "ص";
    hours12 = hours12 % 12;
    hours12 = hours12 || 12;
    const year = date.getFullYear();
    let month = date.getMonth();
    month = Number(month) + 1 < 10 ? "0" + (Number(month) + 1) : Number(month) + 1;
    let day = date.getDate();
    hours12 = hours12 < 10 ? "0" + hours12 : hours12;
    hours24 = hours24 < 10 ? "0" + hours24 : hours24;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    day = day < 10 ? "0" + day : day;
    if (isNaN(year) == true) {
        return null;
    }
    if (typeOfFormat == 1) {
        const strTime =
            year + "/" + month + "/" + day + ", " + hours12 + ":" + minutes + ampm;
        return strTime;
    } else if (typeOfFormat == 3) {
        const strTime =
            year + "-" + month + "-" + day + "T" + hours24 + ":" + minutes + ":" + seconds;
        return strTime;
    } else if (typeOfFormat == "id") {
        const strTime =
            `${month}${day}${hours24}${minutes}${seconds}`;
        return strTime;
    } else {
        const strTime =
            year + "-" + month + "-" + day;
        return strTime;
    }
}