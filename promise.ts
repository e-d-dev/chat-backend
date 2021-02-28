
// programm start
console.log("Hallo");

let test = log().then();


// funktionsdefinition async
async function log(): Promise<any> {
    return new Promise((resolve) => {

        let rechnung;
        // 3 sekunden

        // 4 sekunden


        resolve(true);
    })

    console.log("Welt");
}
