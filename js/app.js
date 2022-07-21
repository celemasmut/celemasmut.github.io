const actualPresupuesto = document.getElementById('presupuesto');
const body = document.getElementById('body');
const porcentaje = document.getElementById('porcentaje');
const misIngresos = document.getElementById('ingresos');
const misEgresos = document.getElementById('egresos');
const actualDolarBlue = document.getElementById('dolar-blue');
const ingresosList = document.getElementById('lista-ingresos');
const egresosList = document.getElementById('lista-egresos');

const ingresosStorages = localStorage.getItem('ingresos');
const egresosStorages = localStorage.getItem('egresos');
const ingresos = JSON.parse(ingresosStorages) ?? [];

const egresos = JSON.parse(egresosStorages) ?? [];

let cargarApp = ()=> {
    cargarCabecero();
    cargarIngresos();
    cargarEgresos();
}

const API_URL = 'https://api.bluelytics.com.ar/';
const endPointDolarBlue = 'v2/latest';
let dolarBlue;
const obtenerDatosDolar = () => {
    fetch(API_URL + endPointDolarBlue)
    .then((response) => response.json())
    .then((responseData) => {
        dolarBlue = responseData.blue.value_sell;
        console.log(dolarBlue); 
        actualDolarBlue.innerHTML = formatoMoneda(dolarBlue);  
    });
}  

let totalIngresos = ()=> {
    let totalIngreso =0;
    ingresos.forEach((ingreso) => {
        totalIngreso = totalIngreso +ingreso.valor;
        console.log("ingreso valor: " + ingreso.valor);
        console.log("total ingreso: " + totalIngreso);
    })
    return totalIngreso;
}

let totalEgresos = ()=> {
    let totalEgreso =0;
    egresos.forEach((egreso) => {
        totalEgreso += egreso.valor;
    })
    return totalEgreso;
}

let cargarCabecero = ()=>{
    let presupuesto = totalIngresos() - totalEgresos();
    let porcentajeEgresos = totalEgresos()/totalIngresos();
    actualPresupuesto.innerHTML = formatoMoneda(presupuesto); 
    porcentaje.innerHTML = formatoPorcentaje(porcentajeEgresos);
    misIngresos.innerHTML = formatoMoneda(totalIngresos());
    misEgresos.innerHTML = formatoMoneda(totalEgresos());
    obtenerDatosDolar();
}

const formatoMoneda = (valor)=> {
    return valor.toLocaleString('en-US', {style:'currency', currency:'USD', minimunFractionDigits:2});
}

const formatoPorcentaje = (valor)=> {
    return valor.toLocaleString('en-US', {style:'percent', minimunFractionDigits:2 });
}

const cargarIngresos = ()=> {
    let ingresosHTML = '';
    ingresos.forEach((ingreso) => {
        ingresosHTML += crearIngresoHTML(ingreso);
    })
    ingresosList.innerHTML = ingresosHTML;
}

const cargarEgresos = ()=> {
    let egresosHTML = '';
    egresos.forEach((egreso) => {
        egresosHTML += crearEgresoHTML(egreso);
    })
    egresosList.innerHTML = egresosHTML;
}

const crearIngresoHTML = (ingreso) => {
    let ingresoHTML = `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${ingreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">${formatoMoneda(ingreso.valor)}</div>
            <div class="elemento_eliminar">
                <button class="elemento_eliminar--btn">
                    <ion-icon name="close-outline"
                     onclick='eliminarIngreso(${ingreso.id})'></ion-icon>
                </button>
            </div>
        </div>
    </div>
    `;
    return ingresoHTML;
}
const crearEgresoHTML = (egreso) => {
    let egresoHTML = `
    <div class="elemento limpiarEstilos">
        <div class="elemento_descripcion">${egreso.descripcion}</div>
        <div class="derecha limpiarEstilos">
            <div class="elemento_valor">${formatoMoneda(egreso.valor)}</div>
            <div class="elemento_porcentaje">${formatoPorcentaje(egreso.valor / totalEgresos())}</div>
            <div class="elemento_eliminar">
                <button class="elemento_eliminar--btn">
                    <ion-icon name="close-outline" 
                     onclick='eliminarEgreso(${egreso.id})' ></ion-icon>
                </button>
            </div>
        </div>
    </div>
    `;
    return egresoHTML;
}

const eliminarIngreso = (ingresoId) =>{
    Swal.fire({
        title: 'Are you sure you want to delete the description?',
        icon: 'warning',
        confirmButtonText: 'Cool',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      
      }).then((result) => {
        if(result.isConfirmed){
            Swal.fire({ 
                title:'Deleted!',
                text:'Your description has been deleted.',
                icon:'success',
                timer:1500,
                showConfirmButton: false,
            })
            const indiceEliminar = ingresos.findIndex(ingreso =>ingreso.id === ingresoId);
            ingresos.splice(indiceEliminar,1);
            cargarCabecero();
            cargarIngresos();
        }
    })
}

const eliminarEgreso = (egresoId) =>{
    Swal.fire({
        title: 'Are you sure you want to delete the description?',
        icon: 'warning',
        confirmButtonText: 'Cool',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      
      }).then((result) => {
        if(result.isConfirmed){
            Swal.fire({ 
                title:'Deleted!',
                text:'Your description has been deleted.',
                icon:'success',
                timer:1500,
                showConfirmButton: false,
            })
            const indiceEliminar = egresos.findIndex(egreso =>egreso.id === egresoId);
            egresos.splice(indiceEliminar,1);
            cargarCabecero();
            cargarEgresos();
        }
    })
}

const agregarDato = ()=> {
    Swal.fire({
        title: 'Congrats!',
        text: 'you add a new description',
        icon: 'success',
        confirmButtonText: 'Cool'
      })
    const form = document.forms['form'];
    const tipo = form ['tipo'];
    const descripcion = form ['descripcion'];
    const valor = form ['valor'];
    if(descripcion.value !== '' && valor.value !== ''){
        if(tipo.value === 'ingreso'){
            ingresos.push(new Ingreso(descripcion.value, Number(valor.value)));
            localStorage.setItem('ingresos', JSON.stringify(ingresos));
            cargarCabecero();
            cargarIngresos();
        }else if(tipo.value === 'egreso'){
            egresos.push(new Egreso(descripcion.value, Number(valor.value)));
            localStorage.setItem('egresos', JSON.stringify(egresos));
            cargarCabecero();
            cargarEgresos();
        }
    }
}
