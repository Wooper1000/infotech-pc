import config from "@/config/config.json";


export default async function (obit,func){
    let response = await fetch(config.serverURL + '/get-ports' + `?obit=${obit}`);
    const reader = response.body.getReader();

    let result = '';
let a = true
    while (a) {
        const { done, value } = await reader.read();
        if (done) break;
        result = new TextDecoder().decode(value);
        // Обрабатывайте полученные данные здесь, например:
        func(result)
    }
    }




