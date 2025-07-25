let productos = [];

fetch("./json/productos.json")
  .then((res) => res.json())
  .then((data) => {
    productos = data;
    mostrarProductos(); // solo muestra cuando están cargados
  })
  .catch((error) => {
    console.error("Error al cargar los productos:", error);
  });

  const contenedorProductos = document.getElementById("productos");
  const contenedorCarrito = document.getElementById("carrito");
  const totalCarrito = document.getElementById("totalCarrito");
  const formulario = document.getElementById("formularioCompra");
  const botonFinalizar = document.getElementById("mostrarFormulario");
  const metodoEnvio = document.getElementById("envio");
  const direccionGrupo = document.getElementById("direccionGrupo");
  const infoLocal = document.getElementById("infoLocal");

  let carrito = [];

  function mostrarProductos() {
    contenedorProductos.innerHTML = "";
    productos.forEach((producto) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h3>${producto.nombre}</h3>
        <img src="${producto.imagen}" alt="${producto.nombre}" width="100">
        <p>$${producto.precio}</p>
        <button onclick="agregarAlCarrito(${producto.id})" class="btn btn-primary">Agregar</button>
      `;
      contenedorProductos.appendChild(div);
    });
  }

  window.agregarAlCarrito = function (id) {
    const item = carrito.find((p) => p.id === id);
    if (item) {
      item.cantidad++;
    } else {
      const producto = productos.find((p) => p.id === id);
      carrito.push({ ...producto, cantidad: 1 });
       Swal.fire({
      title: '¡Agregado!',
      text: `${producto.nombre} fue agregado al carrito`,
      icon: 'success',
      timer: 1200,
      showConfirmButton: false
    });
    }
   
    mostrarCarrito();
  };

  window.eliminarDelCarrito = function (id) {
    carrito = carrito.filter((p) => p.id !== id);
    mostrarCarrito();
  };

  window.cambiarCantidad = function (id, cambio) {
    const item = carrito.find((p) => p.id === id);
    if (item) {
      item.cantidad = Math.max(1, item.cantidad + cambio);
    }
    mostrarCarrito();
  };

  function mostrarCarrito() {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((item) => {
      const div = document.createElement("div");
      div.innerHTML = `
        <h4>${item.nombre}</h4>
        <p>$${item.precio} x ${item.cantidad}</p>
        <button onclick="cambiarCantidad(${item.id}, -1)" class="btn btn-outline-secondary">-</button>
        <button onclick="cambiarCantidad(${item.id}, 1)" class="btn btn-outline-secondary">+</button>
        <button onclick="eliminarDelCarrito(${item.id})" class="btn btn-primary">Eliminar</button>
      `;
      contenedorCarrito.appendChild(div);
    });

    const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
    totalCarrito.textContent = `Total: $${total}`;
  }

  botonFinalizar.addEventListener("click", () => {

 if (!carrito[0]) {
  Swal.fire('Carrito vacío', 'Agrega productos antes de finalizar.', 'warning');
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
    formulario.style.display = "none"; // opcional: también lo podés ocultar
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

  // Si todo está OK:
  Swal.fire("¡Compra realizada!", "Gracias por tu compra", "success");
  carrito = [];
  mostrarCarrito();
  formulario.reset();
  formulario.style.display = "none";
  direccionGrupo.style.display = "none";
  infoLocal.style.display = "none";
  mensajeError.style.display = "none";
});
const botonCancelar = document.getElementById("cancelarCompra");

botonCancelar.addEventListener("click", () => {
  formulario.reset(); // limpia los campos del formulario
  formulario.style.display = "none"; // oculta el formulario
  direccionGrupo.style.display = "none"; // oculta la dirección si estaba activa
  infoLocal.style.display = "none"; // oculta info local si estaba visible
  const mensajeError = document.getElementById("mensajeError");
  mensajeError.style.display = "none"; // borra errores
  mensajeError.textContent = "";
});


  mostrarProductos();

