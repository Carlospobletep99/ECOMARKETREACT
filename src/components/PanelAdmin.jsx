import { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useInventario } from '../context/InventarioContext.jsx';
// Ya no necesitamos useCarrito para actualizar stock, porque editarProducto actualizará
// la base de datos y el inventario, y el carrito se sincronizará solo.
import FormularioProducto from './FormularioProducto.jsx';
import AlertaConfirmacion from './AlertaConfirmacion.jsx';
import { formatearMoneda } from '../utils/formatearMoneda.js';

export default function PanelAdmin() {
  // Extraemos los productos y la función editarProducto que sí conecta a la API
  const { products, crearProducto, editarProducto, eliminarProducto } = useInventario();
  
  const [query, setQuery] = useState('');
  const [draftStock, setDraftStock] = useState({});
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [alerta, setAlerta] = useState(null);
  
  // ESTADO PARA EL MODAL DE CONFIRMACIÓN
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const filteredProducts = useMemo(() => {
    const source = Array.isArray(products) ? products : [];
    const sanitizedQuery = query.trim().replace(/[<>"'%;()&+]/g, '').toLowerCase();
    if (!sanitizedQuery) {
      return source;
    }
    return source.filter(product => {
      return (
        product.nombre.toLowerCase().includes(sanitizedQuery) ||
        product.codigo.toLowerCase().includes(sanitizedQuery)
      );
    });
  }, [products, query]);

  const handleDraftChange = (codigo, value) => {
    setDraftStock(prev => ({ ...prev, [codigo]: value }));
  };

  // --- CORRECCIÓN AQUÍ ---
  // Ahora usamos editarProducto para que el cambio vaya a la Base de Datos
  const handleSubmit = async (event, codigo) => {
    event.preventDefault();
    
    // 1. Obtenemos el valor del input
    const nuevoStock = Number(draftStock[codigo]);

    // 2. Validaciones básicas
    if (isNaN(nuevoStock) || nuevoStock < 0 || !Number.isInteger(nuevoStock)) {
      setAlerta({ variant: 'danger', message: 'Por favor ingresa un número entero positivo.' });
      return;
    }

    // 3. Buscamos el producto original para no perder sus otros datos (nombre, precio, etc.)
    const productoOriginal = products.find(p => p.codigo === codigo);
    if (!productoOriginal) return;

    // 4. Preparamos el objeto con el stock actualizado
    const productoActualizado = {
      ...productoOriginal,
      cantidad: nuevoStock
    };

    // 5. Enviamos al Backend (PUT)
    const result = await editarProducto(codigo, productoActualizado);

    if (result.ok) {
      setDraftStock(prev => ({ ...prev, [codigo]: '' })); // Limpiamos el input
      setAlerta({ variant: 'success', message: 'Stock actualizado correctamente en la base de datos.' });
      setTimeout(() => setAlerta(null), 3000);
    } else {
      setAlerta({ variant: 'danger', message: result.message || 'Error al actualizar.' });
      setTimeout(() => setAlerta(null), 3000);
    }
  };

  // MANEJADORES PARA CREAR/EDITAR/ELIMINAR
  const handleCrearNuevo = () => {
    setProductoEditar(null);
    setMostrarFormulario(true);
  };

  const handleEditarProducto = (producto) => {
    setProductoEditar(producto);
    setMostrarFormulario(true);
  };

  const handleEliminarProducto = (codigo, nombre) => {
    setProductoAEliminar({ codigo, nombre });
    setMostrarConfirmacion(true);
  };

  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;

    const result = await eliminarProducto(productoAEliminar.codigo);
    
    if (result.ok) {
      setAlerta({ variant: 'success', message: 'Producto eliminado correctamente.' });
      setTimeout(() => setAlerta(null), 3000);
    } else {
      setAlerta({ variant: 'danger', message: result.message || 'Error al eliminar' });
      setTimeout(() => setAlerta(null), 3000);
    }
    setMostrarConfirmacion(false);
    setProductoAEliminar(null);
  };

  const handleSubmitFormulario = async (producto) => {
    let result;
    
    if (productoEditar) {
      result = await editarProducto(productoEditar.codigo, producto);
    } else {
      result = await crearProducto(producto);
    }

    if (result.ok) {
      setMostrarFormulario(false);
      setProductoEditar(null);
      setAlerta({ variant: 'success', message: result.message || 'Operación exitosa.' });
      setTimeout(() => setAlerta(null), 3000);
    } else {
      setAlerta({ variant: 'danger', message: result.message || 'Ocurrió un error.' });
      setTimeout(() => setAlerta(null), 3000);
    }
  };

  const handleCerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditar(null);
  };

  return (
    <Container className="py-5">
      <section className="p-4 shadow-sm mb-4 bg-white rounded-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <h2 className="mb-1">Panel de Administración</h2>
            <p className="text-muted mb-0">Gestiona el inventario completo de productos.</p>
          </div>
        </div>

        {alerta && (
          <Alert variant={alerta.variant} className="mt-3 mb-0" dismissible onClose={() => setAlerta(null)}>
            {alerta.message}
          </Alert>
        )}

        <Form className="row g-3 mt-4" onSubmit={event => event.preventDefault()}>
          <Col lg={6}>
            <Form.Control
              type="text"
              id="search-products"
              placeholder="Buscar por nombre o código"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </Col>
          <Col lg={3} className="text-lg-end">
            <Button variant="outline-success" className="w-100 w-lg-auto" onClick={() => setQuery('')}>
              Limpiar búsqueda
            </Button>
          </Col>
          <Col lg={3} className="text-lg-end">
            <Button variant="success" className="w-100 w-lg-auto" onClick={handleCrearNuevo}>
              + Crear nuevo producto
            </Button>
          </Col>
        </Form>
      </section>

      <section>
        <Row xs={1} sm={2} md={3} className="g-4">
          {filteredProducts.map(product => {
            const draftValue = draftStock[product.codigo] ?? '';
            const parsedDraft = Number(draftValue);
            const hasValue = draftValue !== '' && draftValue !== null;
            const isInteger = Number.isInteger(parsedDraft);
            const isNonNegative = parsedDraft >= 0;
            const isInvalid = hasValue && (!isInteger || !isNonNegative);
            // Desactivamos si no hay valor, es inválido o es igual al que ya tiene la BD
            const isDisabled = !hasValue || isInvalid || parsedDraft === product.cantidad;

            return (
              <Col key={product.codigo}>
                <Card className="h-100 shadow-sm">
                  <Card.Img variant="top" src={product.imagen} alt={product.nombre} />
                  <Card.Body className="d-flex flex-column gap-3">
                    <div>
                      <Card.Title>{product.nombre}</Card.Title>
                      <Card.Text className="small text-muted mb-1">Código: {product.codigo}</Card.Text>
                      <Card.Text className="small text-muted mb-1">
                        Unidad: <span className="fw-semibold">{product.unidadMedida}</span>
                      </Card.Text>
                      <Card.Text className="small text-muted mb-1">
                        Precio: <span className="fw-semibold">{formatearMoneda(product.precio)}</span>
                      </Card.Text>
                      <Card.Text className="small text-muted mb-0">
                        Stock actual: <span className="fw-semibold">{product.cantidad}</span>
                      </Card.Text>
                    </div>
                    {/* Formulario de actualización de stock */}
                    <Form onSubmit={event => handleSubmit(event, product.codigo)} className="mt-auto">
                      <Form.Group className="mb-3">
                        <Form.Label>Nueva cantidad</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={draftValue}
                          onChange={event => handleDraftChange(product.codigo, event.target.value)}
                          placeholder="Ej. 25"
                        />
                        {isInvalid && (
                          <div className="text-danger small mt-1">
                            Ingresa un entero mayor o igual a 0.
                          </div>
                        )}
                      </Form.Group>
                      <div className="d-grid gap-2">
                        <Button type="submit" variant="success" disabled={isDisabled}>
                          Actualizar stock
                        </Button>
                        <Button 
                          variant="outline-success" 
                          onClick={() => handleEditarProducto(product)}
                        >
                          Editar producto
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleEliminarProducto(product.codigo, product.nombre)}
                        >
                          Eliminar producto
                        </Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
          {filteredProducts.length === 0 && (
            <Col>
              <Card className="p-4 text-center border-0 shadow-sm">
                <Card.Text>No encontramos productos para “{query}”.</Card.Text>
              </Card>
            </Col>
          )}
        </Row>
      </section>

      {/* MODAL DE FORMULARIO PARA CREAR/EDITAR */}
      <FormularioProducto
        show={mostrarFormulario}
        onClose={handleCerrarFormulario}
        onSubmit={handleSubmitFormulario}
        productoInicial={productoEditar}
      />

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      <AlertaConfirmacion
        mostrar={mostrarConfirmacion}
        alCerrar={() => setMostrarConfirmacion(false)}
        alConfirmar={confirmarEliminacion}
        titulo="Eliminar producto"
        mensaje={`¿Estás seguro de que deseas eliminar el producto "${productoAEliminar?.nombre}"? Esta acción no se puede deshacer.`}
        textoConfirmar="Eliminar"
        textoCancelar="Cancelar"
        variante="danger"
      />
    </Container>
  );
}