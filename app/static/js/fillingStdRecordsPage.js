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
    if (document.querySelector(`#attendenceSelect-${numOfStudent}`).value == "1" || document.querySelector(`#attendenceSelect-${numOfStudent}`).value == "2") {

        document.querySelector(`#revisingForm-${numOfStudent}`).style.display = "block";

        if (studentInfo[numOfStudent].partsTotal.length == 30) {
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

            let studentInfo = responseJson;
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
                            <option value="1">حاضر</option>
                            <option value="2">متأخر</option>
                            <option value="3">غائب بعذر</option>
                            <option value="4">غائب بدون بعذر</option>
                        </select>
                        </div>
                    </div>

                    <div id="memorizingForm-${numOfStudent}" class="form-row mt-3 ">
                        <div class="form-group ">
                            <label for="Memorizing ">الحفظ</label>
                            <select class="form-select form-control " aria-label="Default select example ">
                            <option value="0" disabled selected>اختر حالة حفظ الطالب</option>
                            <option value="1">لم يحفظ</option>
                            <option value="2">نصف وجه</option>
                            <option value="3">وجه واحد</option>
                            <option value="4">وجهان</option>
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

                if (numOfStudent == numsOfStudents.length - 1) {
                    formsContainer.innerHTML += `
        <div class="btnContainer">
            <button style="background-color: #14521c;" class="btn btn-success btn-block confirm-button ">رفـــــــع</button>
        </div>`;
                }

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