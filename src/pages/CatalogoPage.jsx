import { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useInventario } from '../context/InventarioContext.jsx';
import { useCarrito } from '../context/CarritoContext.jsx';
import { formatearMoneda } from '../utils/formatearMoneda.js';

export default function CatalogoPage() {
  // CONTEXTOS Y ESTADOS
  const { products } = useInventario();
  const { addToCart } = useCarrito();
  const [query, setQuery] = useState('');
  const [alerta, setAlerta] = useState(null);

  // FILTRAR PRODUCTOS
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

  const handleClear = () => setQuery('');

  // TÍTULO DINÁMICO DE LA PÁGINA
  useEffect(() => {
    document.title = 'Catálogo - Ecomarket';
  }, []);

  // AGREGAR AL CARRITO
  const handleAddToCart = product => {
    const result = addToCart(product);
    if (!result.ok) {
      setAlerta({ variant: 'warning', message: result.message });
      return;
    }
    setAlerta(null);
  };

  return (
    <Container className="py-5">
      {/* CONTROLES DE BÚSQUEDA */}
      <section className="catalog-controls p-4 shadow-sm mb-4">
        <h2 className="mb-4">Catálogo</h2>
        <Form className="row g-3" onSubmit={event => event.preventDefault()}>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre o código"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </Col>
          <Col md={4} className="text-md-end">
            <Button variant="outline-secondary" className="w-100" onClick={handleClear}>
              Limpiar
            </Button>
          </Col>
        </Form>
        {alerta && (
          <Alert variant={alerta.variant} className="mt-3 mb-0">
            {alerta.message}
          </Alert>
        )}
      </section>

      {/* GRID DE PRODUCTOS */}
      <section>
        <Row xs={1} sm={2} md={3} className="g-4">
          {filteredProducts.map(product => (
            <Col key={product.codigo}>
              <Card className="h-100 shadow-sm product-card">
                <Card.Img variant="top" src={product.imagen} alt={product.nombre} />
                <Card.Body>
                  <Card.Title>{product.nombre}</Card.Title>
                  <Card.Text className="small text-muted">{product.descripcion}</Card.Text>
                  <Card.Text className="small text-muted mb-2">
                    Unidad de medida: <span className="fw-semibold">{product.unidadMedida}</span>
                  </Card.Text>
                  <Card.Text className="small text-muted mb-2">
                    Stock disponible: <span className="fw-semibold">{product.cantidad}</span>
                  </Card.Text>
                  <Card.Text className="fw-semibold mb-3">{formatearMoneda(product.precio)}</Card.Text>
                  <Button 
                    variant="success" 
                    onClick={() => handleAddToCart(product)} 
                    className="mt-auto"
                    disabled={product.cantidad === 0}
                  >
                    Agregar al carrito
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
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