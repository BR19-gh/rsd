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
//         partsTotal: [22, 23, 24, 25, 26, 27, 28, 29, 30]
//     },
//     "4": {
//         id: "4",
//         name: "علان العلاني",
//         partsTotal: [30]
//     },
// }

let listOfStudents;

const setListOfStudents = (responseJson) => {
    listOfStudents = responseJson;
}

/*change Input status For Revising*/
const changeInputForRev = (numOfStudent) => {
    if (document.querySelector(`#checkboxForRev-${numOfStudent}`).checked) {
        document.querySelector(`#inputForRev-${numOfStudent}`).placeholder = "أدخل عدد الأوجه التي تم مراجعتها";
        document.querySelector(`#inputForRev-${numOfStudent}`).disabled = false;
    } else {
        document.querySelector(`#inputForRev-${numOfStudent}`).disabled = true;
        document.querySelector(`#inputForRev-${numOfStudent}`).value = "";
        document.querySelector(`#inputForRev-${numOfStudent}`).placeholder = "هل الطالب أتم المراجعة؟";

    }
}


/*show or hide revising and memorizing*/
const showOrHideRevMemo = (numOfStudent) => {

    if (document.querySelector(`#attendenceSelect-${numOfStudent}`).value == "حاضر" || document.querySelector(`#attendenceSelect-${numOfStudent}`).value == "متأخر") {

        document.querySelector(`#revisingForm-${numOfStudent}`).style.display = "block";

        if (listOfStudents[numOfStudent].partsTotal.length == 30) {
            document.querySelector(`#memorizingForm-${numOfStudent}`).style.display = "none";
        } else {
            document.querySelector(`#memorizingForm-${numOfStudent}`).style.display = "block";
        }

    } else {
        document.querySelector(`#memorizingForm-${numOfStudent}`).style.display = "none";
        document.querySelector(`#revisingForm-${numOfStudent}`).style.display = "none";
    }
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
                studentForms.innerHTML = "حدث وانتظر قليلا إذا كنت قد أضفت";
                console.log(204)
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-info"
                );
                return;
            }
            let i = 0;
            let studentInfo = responseJson;
            setListOfStudents(responseJson)
            let numsOfStudents = Object.keys(studentInfo);
            numsOfStudents.forEach(numOfStudent => {
                formsContainer.innerHTML +=
                    `
    <div style="width: 100%;  display: flex;  justify-content: center;">
        <div class="studentForms card px-1 py-4" style="border: black 0.5px solid; ">
            <div class="card-body">

                <h6 class="card-title text-center fw-bold mb-3">${studentInfo[numOfStudent].id} | ${studentInfo[numOfStudent].name}</h6>

                <form>
                    <div id="attendenceForm" class="form-row">
                        <div class="form-group">
                            <label for="Attendence">الحضور</label>
                            <select onclick="showOrHideRevMemo(${numOfStudent})" id="attendenceSelect-${numOfStudent}" class="form-select form-control " aria-label="Default select example ">
                            <option value="0" disabled selected>اختر حالة حضور الطالب</option>
                            <option value="حاضر">حاضر</option>
                            <option value="متأخر">متأخر</option>
                            <option value="غائب بعذر">غائب بعذر</option>
                            <option value="غائب بدون عذر">غائب بدون عذر</option>
                        </select>
                        </div>
                    </div>

                    <div id="memorizingForm-${numOfStudent}" class="form-row mt-3 ">
                        <div class="form-group ">
                            <label for="Memorizing ">الحفظ</label>
                            <select id="memorizingSelect-${numOfStudent}" class="form-select form-control" aria-label="Default select example ">
                            <option value="0" disabled selected>اختر حالة حفظ الطالب</option>
                            <option value="لم يحفظ">لم يحفظ</option>
                            <option value="نصف وجه">نصف وجه</option>
                            <option value="وجه واحد">وجه واحد</option>
                            <option value="وجهان">وجهان</option>
                        </select>
                        </div>
                    </div>

                    <div id="revisingForm-${numOfStudent}" class="form-row mt-3 ">
                        <div class="form-group ">
                            <label for="Revising ">المراجعة</label>
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <div class="form-control input-group-text" style="border-radius: 0px; border-top-right-radius: 10px; border-bottom-right-radius: 10px;">
                                        <input id="checkboxForRev-${numOfStudent}" onclick="changeInputForRev(${numOfStudent})" type="checkbox" aria-label="Checkbox for following text input">
                                    </div>
                                </div>
                                <input id="inputForRev-${numOfStudent}" placeholder="" style="direction:rtl; border-top-left-radius: 10px; border-bottom-left-radius: 10px;" type="tel" class="form-control" aria-label="Text input with radio button">
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
        `;

                if (i == numsOfStudents.length - 1) {
                    formsContainer.innerHTML += `
        <div class="btnContainer">
            <button id="submitRecordsBtn" onclick="submitRecords()" style="background-color: #14521c;" class="btn btn-success btn-block confirm-button ">رفـــــــع</button>
        </div>`;
                }
                i++;
                changeInputForRev(numOfStudent);
                showOrHideRevMemo(numOfStudent)

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

const submitRecords = () => {
    let valueOfinputForRev;
    let studentsIds = Object.keys(listOfStudents);
    studentsIds.every(studentId => {
        let getOut = false;

        if (document.querySelector(`#attendenceSelect-${studentId}`).value == 0) {
            alert("يجب تعبئة جميع سجلات الطلاب أولا");
            return getOut;

        }
        if (document.querySelector(`#memorizingSelect-${studentId}`).value == 0) {

            if (listOfStudents[studentId].partsTotal.length < 30) {
                alert("يجب تعبئة جميع سجلات الطلاب أولا");
                return getOut;
            }

        }
        if (document.querySelector(`#checkboxForRev-${studentId}`).checked) {

            if (document.querySelector(`#inputForRev-${studentId}`) == "") {
                alert("يجب تعبئة جميع سجلات الطلاب أولا");
                return getOut;
            }
            valueOfinputForRev = document.querySelector(`#inputForRev-${studentId}`);
        } else {
            valueOfinputForRev = "لم يراجع"
        }

        fetch("/record", {
                headers: {
                    stdId: encodeURIComponent(studentId),
                    attStat: encodeURIComponent(document.querySelector(`#attendenceSelect-${studentId}`).value),
                    memoStat: encodeURIComponent(document.querySelector(`#memorizingSelect-${studentId}`).value),
                    revStat: encodeURIComponent(valueOfinputForRev),
                    recordDate: encodeURIComponent(formatTheDate(new Date(), 'basic')),
                },
                method: "POST",
            })
            .then((response) => {
                return response.json();
            })
            .then((responseJson) => {
                // if (responseJson.statCode == 403) {
                //     alert(
                //         "الرقم التعريفي للطالب المراد إضافته موجود مسبقا\nالرجاء المحاولة مجددًا باستخدام رقم آخر. \n\n ErrCode: 403-info"
                //     ) | $("#studentModal").modal("show");
                //     return;
                // }
                // if (responseJson.statCode == 400) {
                //     alert(
                //         "هناك مدخلات أُدخلت بشكل خاطئ\nالرقم التعريفي أُدخل فيه نص، يجب إدخاله على شكل رقم فقط. \n\n ErrCode: 400-info"
                //     ) | $("#studentModal").modal("show");
                //     return;
                // }
                // if (responseJson.statCode == 429) {
                //     alert(
                //         "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-info"
                //     ) | $("#studentModal").modal("show");
                //     return;
                // }
                if (responseJson.statCode) {
                    alert(
                        "حدث خطأ من طرف السيرفر\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrCode: 530-info"
                    );
                    return;
                }

                alert(
                    `تم إضافة سجلات الطلاب لتاريخ ${formatTheDate(new Date(), 1)} بنجاح، إنتظر قليلا وستظهر التحديثات`
                );
                window.reload
            })
            .catch((error) => {
                alert(
                    `توجد مشكلة في التواصل مع السيرفر،\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrMsg: ${error}\n ErrCode: 516\n err-fetch-info: student\n التاريخ: ${formatTheDate(
                    new Date(), 1
                )}`
                );
            });

    });


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
    } else if (typeOfFormat == "basic") {
        const strTime =
            year + "-" + month + "-" + day;
        return strTime;
    }
}