
import httpService from "./http.service";
//const urlResource = "https://labsys.frc.utn.edu.ar/dds-express/api/articulos";

// mas adelante podemos usar un archivo de configuracion para el urlResource
 const urlResource = "http://localhost:4000/api/empleados";


async function Buscar(ApellidoYNombre, Pagina) {
  const resp = await httpService.get(urlResource, {
    params: { ApellidoYNombre, Pagina },
  });
  return resp.data;
}


async function BuscarPorId(item) {
  const resp = await httpService.get(urlResource + "/" + item.IdEmpleado);
  return resp.data;
}


async function ActivarDesactivar(item) {
  await httpService.delete(urlResource + "/" + item.IdEmpleado);
}


async function Grabar(item) {
  if (item.IdEmpleado === 0) {
    await httpService.post(urlResource, item);
  } else {
    await httpService.put(urlResource + "/" + item.IdEmpleado, item);
  }
}


export const empleadosService = {
  Buscar,BuscarPorId,ActivarDesactivar,Grabar
};
