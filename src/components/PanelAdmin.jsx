import { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useInventario } from '../context/InventarioContext.jsx';
import { useCarrito } from '../context/CarritoContext.jsx';

export default function PanelAdmin({ onLogout }) {
  const { products } = useInventario();
  const { updateProductStock } = useCarrito();
  const [query, setQuery] = useState('');
  const [draftStock, setDraftStock] = useState({});

  const filteredProducts = useMemo(() => {
    const source = Array.isArray(products) ? products : [];
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) {
      return source;
    }
    return source.filter(product => {
      return (
        product.nombre.toLowerCase().includes(lowerQuery) ||
        product.codigo.toLowerCase().includes(lowerQuery)
      );
    });
  }, [products, query]);

  const handleDraftChange = (codigo, value) => {
    setDraftStock(prev => ({ ...prev, [codigo]: value }));
  };

  const handleSubmit = (event, codigo) => {
    event.preventDefault();
    const result = updateProductStock(codigo, draftStock[codigo]);
    if (result.ok) {
      setDraftStock(prev => ({ ...prev, [codigo]: '' }));
    }
  };

  return (
    <Container className="py-5">
      <section className="p-4 shadow-sm mb-4 bg-white rounded-4">
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
          <div>
            <h2 className="mb-1">Gestión de inventario</h2>
            <p className="text-muted mb-0">Gestiona el stock disponible para cada producto.</p>
          </div>
          <Button variant="outline-danger" onClick={onLogout}>
            Cerrar sesión
          </Button>
        </div>
        <Form className="row g-3 mt-4" onSubmit={event => event.preventDefault()}>
          <Col lg={8}>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o código"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </Col>
          <Col lg={4} className="text-lg-end">
            <Button variant="success" className="w-100 w-lg-auto" onClick={() => setQuery('')}>
              Limpiar búsqueda
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
                        Precio: <span className="fw-semibold">${product.precio.toLocaleString('es-CL')}</span>
                      </Card.Text>
                      <Card.Text className="small text-muted mb-0">
                        Stock actual: <span className="fw-semibold">{product.cantidad}</span>
                      </Card.Text>
                    </div>
                    <Form onSubmit={event => handleSubmit(event, product.codigo)} className="mt-auto">
                      <Form.Group className="mb-3">
                        <Form.Label>Nueva cantidad</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          value={draftValue}
                          isInvalid={isInvalid}
                          onChange={event => handleDraftChange(product.codigo, event.target.value)}
                          placeholder="Ej. 25"
                        />
                        <Form.Control.Feedback type="invalid">
                          Ingresa un entero mayor o igual a 0.
                        </Form.Control.Feedback>
                      </Form.Group>
                      <div className="d-grid">
                        <Button type="submit" variant="success" disabled={isDisabled}>
                          Actualizar stock
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
    </Container>
  );
}

PanelAdmin.propTypes = {
  onLogout: PropTypes.func.isRequired
};
