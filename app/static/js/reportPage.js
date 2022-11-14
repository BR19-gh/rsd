fetchRecords();

function fetchRecords() {
    fetch("/records", {
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
                tbody.innerHTML = "حدث وانتظر قليلا إذا كنت قد أضفت سجلات";
                console.log(204)
                return;
            }
            if (responseJson.statCode == 429) {
                alert(
                    "لقد تجاوزت العدد المسموح من الطلبات على السيرفر في وقت معين،\n إنتظر قليلا ثم حاول الطلب مجددا. \n\n ErrCode: 429-info"
                );
                return;
            }

            let records = responseJson;
            let tbody = document.querySelector("tbody");
            let numsOfStudents = Object.keys(records);
            tbody.innerHTML = '';
            numsOfStudents.forEach(numOfStudent => {

                tbody.innerHTML +=
                    `
                <tr>
                    <td>${records[numOfStudent].stdId}</td>
                    <td>${records[numOfStudent].attStat}</td>
                    <td>${وجه(records[numOfStudent].memoStat)}</td>
                    <td>${وجه(records[numOfStudent].revStat)}</td>
                    <td>${records[numOfStudent].recordDate}</td>               
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


// how to spell وجهs
const وجه = (num) => {
    if (num == 0) return `لم يحفظ`;
    if (num == 1) return `وجه واحد`;
    if (num == 0.5) return `نصف وجه`;
    else if (num > 10) return `${num} وجه`;
    else if (num < 11 && num > 2) return `${num} أوجه`;
    else if (num == 2) return "وجهان";
    else return `${num}`;
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