import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

export default function FormularioProducto({ show, onClose, onSubmit, productoInicial = null }) {
  const esEdicion = productoInicial !== null;

  // ESTADO DEL FORMULARIO
  const [formData, setFormData] = useState({
    codigo: '',
    nombre: '',
    descripcion: '',
    categoria: '',
    precio: '',
    cantidad: '',
    unidadMedida: '',
    imagen: '',
    fechaVencimiento: '',
    nombreProveedor: '',
    codigoProveedor: ''
  });

  const [errores, setErrores] = useState({});

  // CARGAR DATOS SI ES EDICIÓN
  useEffect(() => {
    if (productoInicial) {
      setFormData({
        codigo: productoInicial.codigo || '',
        nombre: productoInicial.nombre || '',
        descripcion: productoInicial.descripcion || '',
        categoria: productoInicial.categoria || '',
        precio: productoInicial.precio?.toString() || '',
        cantidad: productoInicial.cantidad?.toString() || '',
        unidadMedida: productoInicial.unidadMedida || '',
        imagen: productoInicial.imagen || '',
        fechaVencimiento: productoInicial.fechaVencimiento || '',
        // AQUÍ EL CAMBIO: Ya no leemos desde productoInicial.proveedor.x, sino directo
        nombreProveedor: productoInicial.nombreProveedor || productoInicial.proveedor?.nombreProveedor || '',
        codigoProveedor: productoInicial.codigoProveedor?.toString() || productoInicial.proveedor?.codigoProveedor?.toString() || ''
      });
    } else {
      setFormData({
        codigo: '',
        nombre: '',
        descripcion: '',
        categoria: '',
        precio: '',
        cantidad: '',
        unidadMedida: '',
        imagen: '',
        fechaVencimiento: '',
        nombreProveedor: '',
        codigoProveedor: ''
      });
    }
    setErrores({});
  }, [productoInicial, show]);

  // MANEJO DE CAMBIOS EN LOS INPUTS
  const handleChange = (campo, valor) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores(prev => ({ ...prev, [campo]: '' }));
    }
  };

  // VALIDACIÓN DEL FORMULARIO
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formData.codigo.trim()) nuevosErrores.codigo = 'El código es obligatorio.';
    if (!formData.nombre.trim()) nuevosErrores.nombre = 'El nombre es obligatorio.';
    if (!formData.descripcion.trim()) nuevosErrores.descripcion = 'La descripción es obligatoria.';
    if (!formData.categoria.trim()) nuevosErrores.categoria = 'La categoría es obligatoria.';

    const precio = Number(formData.precio);
    if (!formData.precio || isNaN(precio) || precio <= 0) {
      nuevosErrores.precio = 'Ingresa un precio válido mayor a 0.';
    }

    const cantidad = Number(formData.cantidad);
    if (formData.cantidad === '' || isNaN(cantidad) || cantidad < 0 || !Number.isInteger(cantidad)) {
      nuevosErrores.cantidad = 'Ingresa una cantidad válida (entero mayor o igual a 0).';
    }

    if (!formData.unidadMedida.trim()) nuevosErrores.unidadMedida = 'La unidad de medida es obligatoria.';
    if (!formData.imagen.trim()) nuevosErrores.imagen = 'La ruta de la imagen es obligatoria.';
    if (!formData.fechaVencimiento) nuevosErrores.fechaVencimiento = 'La fecha de vencimiento es obligatoria.';
    if (!formData.nombreProveedor.trim()) nuevosErrores.nombreProveedor = 'El nombre del proveedor es obligatorio.';

    const codigoProveedor = Number(formData.codigoProveedor);
    if (!formData.codigoProveedor || isNaN(codigoProveedor) || codigoProveedor <= 0 || !Number.isInteger(codigoProveedor)) {
      nuevosErrores.codigoProveedor = 'Ingresa un código de proveedor válido.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // ENVÍO DEL FORMULARIO
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    // AQUÍ EL CAMBIO: Construir el objeto PLANO para Java
    const producto = {
      codigo: formData.codigo.trim(),
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      categoria: formData.categoria.trim(),
      precio: Number(formData.precio),
      cantidad: Number(formData.cantidad),
      unidadMedida: formData.unidadMedida.trim(),
      imagen: formData.imagen.trim(),
      fechaVencimiento: formData.fechaVencimiento,
      // Se envían directo en la raíz del JSON
      nombreProveedor: formData.nombreProveedor.trim(),
      codigoProveedor: Number(formData.codigoProveedor)
    };

    onSubmit(producto);
  };

  return (
    <Modal show={show} onHide={onClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{esEdicion ? 'Editar Producto' : 'Crear Nuevo Producto'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* ... (El resto del JSX se mantiene igual, son solo inputs visuales) ... */}
          {/* Para ahorrar espacio no repito todo el JSX de los inputs ya que no cambiaron, 
              solo la lógica de arriba. Asegúrate de mantener tu return completo aquí. 
              Si lo necesitas completo dímelo. */}
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="codigo">Código del producto *</Form.Label>
                <Form.Control
                  type="text"
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  placeholder="Ej: P010"
                  disabled={esEdicion}
                />
                {errores.codigo && <div className="text-danger small mt-1">{errores.codigo}</div>}
              </Form.Group>
            </Col>
            {/* ... Resto de tus inputs (Nombre, Descripción, etc.) ... */}
            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="nombre">Nombre del producto *</Form.Label>
                <Form.Control
                  type="text"
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  placeholder="Ej: Quinoa Orgánica"
                />
                {errores.nombre && <div className="text-danger small mt-1">{errores.nombre}</div>}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label htmlFor="descripcion">Descripción *</Form.Label>
                <Form.Control
                  as="textarea"
                  id="descripcion"
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) => handleChange('descripcion', e.target.value)}
                  placeholder="Describe las características del producto..."
                />
                {errores.descripcion && <div className="text-danger small mt-1">{errores.descripcion}</div>}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="categoria">Categoría *</Form.Label>
                <Form.Control
                  type="text"
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => handleChange('categoria', e.target.value)}
                  placeholder="Ej: Frutas Orgánicas"
                />
                {errores.categoria && <div className="text-danger small mt-1">{errores.categoria}</div>}
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group>
                <Form.Label htmlFor="unidadMedida">Unidad de medida *</Form.Label>
                <Form.Control
                  type="text"
                  id="unidadMedida"
                  value={formData.unidadMedida}
                  onChange={(e) => handleChange('unidadMedida', e.target.value)}
                  placeholder="Ej: 1 kg, Pack 500g"
                />
                {errores.unidadMedida && <div className="text-danger small mt-1">{errores.unidadMedida}</div>}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label htmlFor="precio">Precio (CLP) *</Form.Label>
                <Form.Control
                  type="number"
                  id="precio"
                  min="1"
                  step="1"
                  value={formData.precio}
                  onChange={(e) => handleChange('precio', e.target.value)}
                  placeholder="Ej: 1500"
                />
                {errores.precio && <div className="text-danger small mt-1">{errores.precio}</div>}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label htmlFor="cantidad">Cantidad en stock *</Form.Label>
                <Form.Control
                  type="number"
                  id="cantidad"
                  min="0"
                  step="1"
                  value={formData.cantidad}
                  onChange={(e) => handleChange('cantidad', e.target.value)}
                  placeholder="Ej: 50"
                />
                {errores.cantidad && <div className="text-danger small mt-1">{errores.cantidad}</div>}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label htmlFor="fechaVencimiento">Fecha de vencimiento *</Form.Label>
                <Form.Control
                  type="date"
                  id="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={(e) => handleChange('fechaVencimiento', e.target.value)}
                />
                {errores.fechaVencimiento && <div className="text-danger small mt-1">{errores.fechaVencimiento}</div>}
              </Form.Group>
            </Col>

            <Col md={12}>
              <Form.Group>
                <Form.Label htmlFor="imagen">Ruta de la imagen *</Form.Label>
                <Form.Control
                  type="text"
                  id="imagen"
                  value={formData.imagen}
                  onChange={(e) => handleChange('imagen', e.target.value)}
                  placeholder="Ej: /images/producto.png"
                />
                {errores.imagen && <div className="text-danger small mt-1">{errores.imagen}</div>}
              </Form.Group>
            </Col>

            <Col md={8}>
              <Form.Group>
                <Form.Label htmlFor="nombreProveedor">Nombre del proveedor *</Form.Label>
                <Form.Control
                  type="text"
                  id="nombreProveedor"
                  value={formData.nombreProveedor}
                  onChange={(e) => handleChange('nombreProveedor', e.target.value)}
                  placeholder="Ej: EcoFrutas Chile"
                />
                {errores.nombreProveedor && <div className="text-danger small mt-1">{errores.nombreProveedor}</div>}
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group>
                <Form.Label htmlFor="codigoProveedor">Código proveedor *</Form.Label>
                <Form.Control
                  type="number"
                  id="codigoProveedor"
                  min="1"
                  step="1"
                  value={formData.codigoProveedor}
                  onChange={(e) => handleChange('codigoProveedor', e.target.value)}
                  placeholder="Ej: 101"
                />
                {errores.codigoProveedor && <div className="text-danger small mt-1">{errores.codigoProveedor}</div>}
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex gap-2 justify-content-end mt-4">
            <Button variant="outline-secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button variant="success" type="submit">
              {esEdicion ? 'Guardar cambios' : 'Crear producto'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

FormularioProducto.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  productoInicial: PropTypes.object
};
