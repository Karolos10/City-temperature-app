require('dotenv').config()



const { leerInput, inquireMenu, pausa, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busquedas");


const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquireMenu();

        switch (opt) {
            case 1:

                //Mostrar mensaje

                const termino = await leerInput('Ciudad: ');

                //Buscar los lugares

                const lugares = await busquedas.ciudad(termino);

                //Seleccionar el lugar

                const id_seleccionado = await listarLugares(lugares);
                if( id_seleccionado === '0' ) continue;
                const lugar_seleccionado = lugares.find(l => l.id === id_seleccionado);

                //Guardar en db
                busquedas.agregarHistorial( lugar_seleccionado.nombre );

                //Dats del clima

                const clima = await busquedas.climaLugar(lugar_seleccionado.lat, lugar_seleccionado.lng);

                //Mostrar Resultados

                console.clear();
                console.log('\nInformacion del lugar\n'.green);
                console.log('Ciudad:', lugar_seleccionado.nombre.green);
                console.log('Lat:', lugar_seleccionado.lat);
                console.log('Lng:', lugar_seleccionado.lng);
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('Como esta el clima:', clima.desc.green);
                break;

            case 2:

                busquedas.historialCapitalizado.forEach(( lugar, i ) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }` );
                })
                break;
        }

        if (opt !== 0) await pausa();

    } while (opt !== 0);

}

main();