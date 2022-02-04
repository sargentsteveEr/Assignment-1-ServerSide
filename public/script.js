//import { get } from "http";

const submit = document.querySelector('#submit');

/*async function get(){
    const response = await fetch('/api');
    const info = await response.json();
    console.log(info);

}*/

submit.addEventListener("click", async ()=>{

    let name = document.getElementById('submit2').value
        
        if (name.length < 1){

            console.log("Client: POST Request contained no info")

            const options = {
                method: 'POST',
                headers: {"content-type": "application/json"},
                body: JSON.stringify({"error":name}),
            }

            const response = await fetch('/api', options);
            console.log(response);
    
        } else {

            console.log("Client: POST Request sent")
            
            const options = {
                method: 'POST',
                headers: {"content-type": "application/json"},
                body: JSON.stringify({"Name":name}),
            }

            const response = await fetch('/api', options);
            console.log(response);

        }

});