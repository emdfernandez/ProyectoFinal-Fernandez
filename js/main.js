let productos = [];

const contenedorProductos = document.getElementById("productos");
const contenedorCarrito = document.getElementById("carrito");
const totalCarrito = document.getElementById("totalCarrito");
const formulario = document.getElementById("formularioCompra");
const botonFinalizar = document.getElementById("mostrarFormulario");
const botonCancelar = document.getElementById("cancelarCompra");
const botonVaciar = document.getElementById("vaciarCarrito");
const metodoEnvio = document.getElementById("envio");
const direccionGrupo = document.getElementById("direccionGrupo");
const infoLocal = document.getElementById("infoLocal");
const mensajeError = document.getElementById("mensajeError");
const resumenCompra = document.getElementById("resumenCompra");
const abrirCarritoBtn = document.getElementById("abrirCarrito");
const cerrarCarritoBtn = document.getElementById("cerrarCarrito");
const carritoPanel = document.getElementById("carritoPanel");

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

fetch("./json/productos.json")
  .then((res) => res.json())
  .then((data) => {
    productos = data;
    mostrarProductos();
    mostrarCarrito(); // mostrar si hay algo del storage
  })
  .catch((error) => {
    console.error("Error al cargar los productos:", error);
  });
function mostrarProductos() {
  while (contenedorProductos.firstChild) {
    contenedorProductos.removeChild(contenedorProductos.firstChild);
  }

  productos.forEach((producto) => {
    const div = document.createElement("div");
    const titulo = document.createElement("h3");
    titulo.textContent = producto.nombre;

    const imagen = document.createElement("img");
    imagen.setAttribute("src", producto.imagen);
    imagen.setAttribute("alt", producto.nombre);
    imagen.setAttribute("width", "100");

    const precio = document.createElement("p");
    precio.textContent = `$${producto.precio}`;

    const btn = document.createElement("button");
    btn.textContent = "Agregar";
    btn.className = "btn btn-primary";
    btn.addEventListener("click", () => agregarAlCarrito(producto.id));

    div.appendChild(titulo);
    div.appendChild(imagen);
    div.appendChild(precio);
    div.appendChild(btn);

    contenedorProductos.appendChild(div);
  });
}

function agregarAlCarrito(id) {
  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.cantidad++;
  } else {
    const producto = productos.find((p) => p.id === id);
    carrito.push({ ...producto, cantidad: 1 });
    Swal.fire({
      title: "¡Agregado!",
      text: `${producto.nombre} fue agregado al carrito`,
      icon: "success",
      timer: 1200,
      showConfirmButton: false,
    });
  }
  guardarCarrito();
  mostrarCarrito();
}

function eliminarDelCarrito(id) {
  carrito = carrito.filter((p) => p.id !== id);
  guardarCarrito();
  mostrarCarrito();
}

abrirCarritoBtn.addEventListener("click", () => {
  carritoPanel.classList.add("visible");
});

cerrarCarritoBtn.addEventListener("click", () => {
  carritoPanel.classList.remove("visible");
});
function cambiarCantidad(id, cambio) {
  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.cantidad = Math.max(1, item.cantidad + cambio);
  }
  guardarCarrito();
  mostrarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  mostrarCarrito();
}
function mostrarCarrito() {

  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }

  carrito.forEach((item) => {
    const div = document.createElement("div");
    div.classList.add("item-carrito", "d-flex", "align-items-center", "mb-3", "gap-3");
    // Imagen del producto
    const imagen = document.createElement("img");
    imagen.src = item.imagen;
    imagen.alt = item.nombre;
    imagen.width = 60;
    imagen.height = 60;
    imagen.style.objectFit = "cover";
    imagen.style.borderRadius = "8px";
    // Nombre
    const nombre = document.createElement("h4");
    nombre.textContent = item.nombre;
    nombre.style.margin = "0";
    // Precio y cantidad
    const precioCantidad = document.createElement("p");
    precioCantidad.textContent = `$${item.precio} x ${item.cantidad}`;
    precioCantidad.style.margin = "0";
    // Botones
    const menos = document.createElement("button");
    menos.textContent = "-";
    menos.className = "btn btn-outline-secondary btn-sm";
    menos.addEventListener("click", () => cambiarCantidad(item.id, -1));

    const mas = document.createElement("button");
    mas.textContent = "+";
    mas.className = "btn btn-outline-secondary btn-sm";
    mas.addEventListener("click", () => cambiarCantidad(item.id, 1));

    const eliminar = document.createElement("button");
    eliminar.textContent = "Eliminar";
    eliminar.className = "btn btn-danger btn-sm";
    eliminar.addEventListener("click", () => eliminarDelCarrito(item.id));

    const infoDiv = document.createElement("div");
    infoDiv.appendChild(nombre);
    infoDiv.appendChild(precioCantidad);

    // Contenedor de botones
    const botonesDiv = document.createElement("div");
    botonesDiv.classList.add("d-flex", "gap-2", "mt-2");
    botonesDiv.appendChild(menos);
    botonesDiv.appendChild(mas);
    botonesDiv.appendChild(eliminar);

    infoDiv.appendChild(botonesDiv);
    div.appendChild(imagen);
    div.appendChild(infoDiv);
    contenedorCarrito.appendChild(div);
  });
  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  totalCarrito.textContent = `Total: $${total}`;
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);

botonFinalizar.addEventListener("click", () => {
  if (!Array.isArray(carrito) || !carrito.some(item => item)) {
    Swal.fire("Carrito vacío", "Agrega productos antes de finalizar.", "warning");
    return;
  }
  formulario.style.display = "block";
});

metodoEnvio.addEventListener("change", () => {
  if (metodoEnvio.value === "domicilio") {
    direccionGrupo.style.display = "block";
    infoLocal.style.display = "none";
  } else {
    direccionGrupo.style.display = "none";
    infoLocal.style.display = "block";
  }
});

formulario.addEventListener("submit", (e) => {
  e.preventDefault();

  const mensajeError = document.getElementById("mensajeError");
  mensajeError.style.display = "none";
  mensajeError.textContent = "";

  if (!carrito[0]) {
    Swal.fire('Carrito vacío', 'Agrega productos antes de confirmar la compra.', 'warning');
    formulario.style.display = "none";
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const apellido = document.getElementById("apellido").value.trim();
  const tarjeta = document.getElementById("tarjeta").value.trim();
  const telefono = document.getElementById("telefono").value.trim();
  const email = document.getElementById("email").value.trim();
  const direccion = document.getElementById("direccion")?.value.trim();

  // Validaciones
  const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const soloNumeros = /^\d+$/;

  if (!nombre || !soloLetras.test(nombre)) {
    mensajeError.textContent = "El nombre es obligatorio y debe contener solo letras.";
    mensajeError.style.display = "block";
    return;
  }

  if (!apellido || !soloLetras.test(apellido)) {
    mensajeError.textContent = "El apellido es obligatorio y debe contener solo letras.";
    mensajeError.style.display = "block";
    return;
  }

  if (!email || !emailValido.test(email)) {
    mensajeError.textContent = "El email es obligatorio y debe tener un formato válido.";
    mensajeError.style.display = "block";
    return;
  }
  if (!/^\d{10}$/.test(telefono)) {
    mensajeError.textContent = "El teléfono debe tener exactamente 10 dígitos numéricos. Sin (0) ni (15)";
    mensajeError.style.display = "block";
    return;
  }

  if (!/^\d{16}$/.test(tarjeta)) {
    mensajeError.textContent = "La tarjeta debe tener exactamente 16 dígitos numéricos.";
    mensajeError.style.display = "block";
    return;
  }


  if (metodoEnvio.value === "domicilio" && (!direccion || !direccion?.[2])) {
    mensajeError.textContent = "Debes ingresar una dirección válida para el envío a domicilio.";
    mensajeError.style.display = "block";
    return;
  }
  const datosFormulario = {
    nombre: formulario.nombre.value.trim(),
    apellido: formulario.apellido.value.trim(),
    tarjeta: formulario.tarjeta.value.trim(),
    telefono: formulario.telefono.value.trim(),
    email: formulario.email.value.trim()
  };

  // Si todo está OK:
  Swal.fire("¡Compra realizada!", "Gracias por tu compra", "success");
  mostrarResumen(datosFormulario);
  carrito = [];
  mostrarCarrito();
  formulario.reset();
  formulario.style.display = "none";
  direccionGrupo.style.display = "none";
  infoLocal.style.display = "none";
  mensajeError.style.display = "none";
});
const btnCancelar = document.getElementById("cancelarCompra");

btnCancelar.addEventListener("click", () => {
  formulario.reset(); // limpia los campos del formulario
  formulario.style.display = "none"; // oculta el formulario
  direccionGrupo.style.display = "none"; // oculta la dirección si estaba activa
  infoLocal.style.display = "none"; // oculta info local si estaba visible
  mensajeError.style.display = "none"; // borra errores
  mensajeError.textContent = "";
});

function mostrarError(mensaje) {
  mensajeError.textContent = mensaje;
  mensajeError.style.display = "block";
}

