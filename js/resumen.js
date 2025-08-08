
function mostrarResumen(datosFormulario) {
  const { nombre, apellido, tarjeta, telefono, email } = datosFormulario;

  const resumen = document.getElementById("resumenCompra");
  resumen.textContent = "";

  const lista = document.createElement("ul");
  let resumenHTML = "<ul>";

  carrito.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.nombre} x ${item.cantidad} - $${item.precio * item.cantidad}`;
    lista.appendChild(li);

    resumenHTML += `<li>${item.nombre} x ${item.cantidad} - $${item.precio * item.cantidad}</li>`;
  });

  resumen.appendChild(lista);

  const total = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  resumenHTML += `</ul>
    <p><strong>Total:</strong> $${total}</p>
    <p><strong>Nombre:</strong> ${nombre} ${apellido}</p>
    <p><strong>Tarjeta:</strong> **** **** **** ${tarjeta.slice(-4)}</p>
    <p><strong>Teléfono:</strong> ${telefono}</p>
    <p><strong>Email:</strong> ${email}</p>`;


  Swal.fire({
    title: "Compra Confirmada",
    html: resumenHTML,
    icon: "success"
  });

  carrito = [];
  guardarCarrito();
  mostrarCarrito();
  formulario.reset();
}




