//tempDB

const studentInfo = {
    "0": {
        id: "1",
        name: "إبراهيم الخويطر",
        partsTotal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    },
    "1": {
        id: "2",
        name: "فلان الفلاني",
        partsTotal: [29, 30]
    },
    "2": {
        id: "3",
        name: "حسام الفايزي",
        partsTotal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
    },
    "3": {
        id: "4",
        name: "عبدالرحمن الخزيم",
        partsTotal: [22, 23, 24, 25, 26, 27, 28, 29, 30, 3, 1, 6, 2]
    },
    "5": {
        id: "5",
        name: "علان العلاني",
        partsTotal: [30]
    },
}

const parts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

// how to spell جزءs
const جزء = (num) => {
    if (num == 1) return `جزء واحد`;
    if (num == 1 || num > 10) return `${num} جزء`;
    else if (num == 2) return "جزءان";
    else return `${num} أجزاء`;
}


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
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-admin"
                );
                return;
            }
            alert(
                "تــمــت إضــافة المعلومات بنجاح إنتظر قليلا وستظهر التحديثات"
            );
            let studentInfo = responseJson;
            let tbody = document.querySelector("tbody");
            let numsOfStudents = Object.keys(studentInfo);
            numsOfStudents.forEach(numOfStudent => {

                tbody.innerHTML +=
                    `
                <tr>
                    <th scope="row">${studentInfo[numOfStudent].id}</th>
                    <td>${studentInfo[numOfStudent].name}</td>
                    <td>${جزء(studentInfo[numOfStudent].partsTotal.length)}</td>
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
                `توجد مشكلة في التواصل مع السيرفر،\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrMsg: ${error}\n ErrCode: 514\n err-fetch-admin: products\n التاريخ: ${formatTheDate(
                    new Date(), 1
                )}`
            );
        });
}


document.querySelector("#addstudent").addEventListener("click", () => {

    if (
        document.querySelector("#productID").value == "" ||
        document.querySelector("#productTitle").value == "" ||
        document.querySelector("#productPrice").value == "" ||
        document.querySelector("#productImg").value == ""
    ) {
        alert("يجب ملئ جميع الخانات أولا");
        setTimeout(() => {
            $("#productModal").modal("show");
        }, 200);
        return;
    }
    fetch("/product", {
            headers: {
                id: encodeURIComponent(document.querySelector("#productID").value),
                title: encodeURIComponent(
                    document.querySelector("#productTitle").value
                ),
                price: encodeURIComponent(
                    document.querySelector("#productPrice").value
                ),
                avail: encodeURIComponent(
                    `${document.querySelector("#productAvail").checked}`
                )
            },
            method: "POST",
            body: uploadImgForm
        })
        .then((response) => {
            return response.json();
        })
        .then((responseJson) => {
            if (responseJson.statCode == 403) {
                alert(
                    "الرقم التعريفي للمنتج المراد إضافته موجود مسبقا\nالرجاء المحاولة مجددًا باستخدام رقم آخر. \n\n ErrCode: 403-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 400) {
                alert(
                    "هناك مدخلات أُدخلت بشكل خاطئ\nالرقم التعريفي أو السعر أُدخل فيه نص، يجب إدخالها على شكل رقم فقط. \n\n ErrCode: 400-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 500) {
                alert(
                    "حدث خطأ من طرف السيرفر\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrCode: 530-admin"
                ) | $("#productModal").modal("show");
                return;
            }

            alert(
                `تم إضافة المنتج رقم ${document.querySelector("#productID").value} بنجاح، إنتظر قليلا وستظهر التحديثات`
            );
            fetchProducts();
            document.querySelector("#productID").value = "";
            document.querySelector("#productTitle").value = "";
            document.querySelector("#productPrice").value = "";
            document.querySelector("#productAvail").checked = false;
            document.querySelector("#productImg").value = "";
        })
        .catch((error) => {
            alert(
                `توجد مشكلة في التواصل مع السيرفر،\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrMsg: ${error}\n ErrCode: 516\n err-fetch-admin: product\n التاريخ: ${formatTheDate(
                    new Date(), 1
                )}`
            );
        });
});

document.querySelector("#updstudent").addEventListener("click", () => {
    if (
        document.querySelector("#productID").value == "" ||
        document.querySelector("#productTitle").value == "" ||
        document.querySelector("#productPrice").value == ""
    ) {
        alert("يجب ملئ جميع الخانات أولا");
        setTimeout(() => {
            $("#productModal").modal("show");
        }, 200);
        return;
    }
    fetch(`/product/${document.querySelector("#productID").value}`, {
            headers: {
                title: encodeURIComponent(
                    document.querySelector("#productTitle").value
                ),
                price: encodeURIComponent(
                    document.querySelector("#productPrice").value
                ),
                avail: encodeURIComponent(
                    `${document.querySelector("#productAvail").checked}`
                )
            },
            method: "PUT"

        })
        .then((response) => {
            return response.json();
        })
        .then((responseJson) => {
            if (responseJson.statCode == 404) {
                alert(
                    "الرقم التعريفي للمنتج المراد تحديثه غير موجود\nالرجاء المحاولة مجددًا باستخدام رقم آخر. \n\n ErrCode: 404-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 400) {
                alert(
                    "هناك مدخلات أُدخلت بشكل خاطئ\nالرقم التعريفي أو السعر أُدخل فيه نص، يجب إدخالها على شكل رقم فقط. \n\n ErrCode: 400-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 500) {
                alert(
                    "حدث خطأ من طرف السيرفر\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrCode: 531-admin"
                ) | $("#productModal").modal("show");
                return;
            }

            alert(
                `تم تعديل المنتج رقم ${document.querySelector("#productID").value} بنجاح، إنتظر قليلا وستظهر التحديثات`
            );
            fetchProducts();
            document.querySelector("#productID").value = "";
            document.querySelector("#productTitle").value = "";
            document.querySelector("#productPrice").value = "";
            document.querySelector("#productAvail").checked = false;
            document.querySelector("#productImg").value = "";
        })
        .catch((error) => {
            alert(
                `توجد مشكلة في التواصل مع السيرفر،\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrMsg: ${error}\n ErrCode: 517\n err-fetch-admin: product\n التاريخ: ${formatTheDate(
                    new Date(), 1
                )}`
            );
        });
});


document.querySelector("#delstudent").addEventListener("click", () => {
    fetch(`/product/${document.querySelector("#productID").value}`, {
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
                    "الرقم التعريفي للمنتج المراد حذفه غير موجود\nالرجاء المحاولة مجددًا باستخدام رقم آخر. \n\n ErrCode: 404-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 400) {
                alert(
                    "هناك مدخلات أُدخلت بشكل خاطئ\nالرقم التعريفي أُدخل فيه نص، يجب إدخاله على شكل رقم فقط. \n\n ErrCode: 400-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-admin"
                ) | $("#productModal").modal("show");
                return;
            }
            if (responseJson.statCode == 500) {
                alert(
                    "حدث خطأ من طرف السيرفر\nحاول مجددًا في وقت لاحق، إذا استمرت المشكلة، تواصل مع المطور. \n\n ErrCode: 532-admin"
                ) | $("#productModal").modal("show");
                return;
            }

            alert(`تم حذف المنتج رقم ${document.querySelector("#productID").value} بنجاح، إنتظر قليلا وستظهر التحديثات`);
            fetchProducts();
            document.querySelector("#productID").value = "";
            document.querySelector("#productTitle").value = "";
            document.querySelector("#productPrice").value = "";
            document.querySelector("#productAvail").checked = false;
            document.querySelector("#productImg").value = "";
        });
});




const deleteOrEditstudent = (id, opration) => {

    (parts).forEach(part => {
        document.querySelector(`#checkboxPart-${part}`).checked = false;
    });
    (studentInfo[id].partsTotal).forEach(part => {
        document.querySelector(`#checkboxPart-${part}`).checked = true;
    });

    if (opration == "edit") {
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
            "هناك خطأ ما،  تواصل مع المطور لحل المشكلة. \n\n ErrCode: 558-admin"
        );
    }
}



parts.forEach(part => {
    document.querySelector("#partsCheckboxs").innerHTML += `
                <div class="checkboxContainer form-check form-check-inline">
                    <input class="checkboxLabel form-check-input" type="checkbox" id="checkboxPart-${part}" value="${part}">
                    <label class="checkboxLabel form-check-label" ">الجزء ${part}</label>
                            </div>
                        `;
});












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