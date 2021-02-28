import { BehaviorSubject} from 'rxjs';



let x: BehaviorSubject<undefined | number>;

a(); // A sollte X setzen 
b(); // B wird X nutzen müssen


function a() {
    x = new BehaviorSubject<undefined | number>(undefined);
    // Anweisung Foo
    // Anweisung Bar
    x.next(10);
}

function b() {

    // Anweisung A
    // Anweisung B

    // nutze X
    x.subscribe((value) => {
        if (value !== undefined) {
            console.log("value",value);
            return 1 + value;
        }
    })

}