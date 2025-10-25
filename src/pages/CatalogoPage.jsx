import { useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { useInventario } from '../context/InventarioContext.jsx';
import { useCarrito } from '../context/CarritoContext.jsx';

export default function CatalogoPage() {
  // CONTEXTO Y ESTADOS LOCALES
  const { products } = useInventario();
  const { addToCart } = useCarrito();
  const [query, setQuery] = useState('');
  const [feedback, setFeedback] = useState(null);

  // FILTRA PRODUCTOS SEGÚN BÚSQUEDA
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

  const handleClear = () => setQuery('');

  // AGREGA PRODUCTO Y MUESTRA ALERTA SI NO HAY STOCK
  const handleAddToCart = product => {
    const result = addToCart(product);
    if (!result.ok) {
      setFeedback({ variant: 'warning', message: result.message });
      return;
    }
    setFeedback(null);
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
            <Button variant="success" className="w-100" onClick={handleClear}>
              Limpiar
            </Button>
          </Col>
        </Form>
        {feedback && (
          <Alert variant={feedback.variant} className="mt-3 mb-0">
            {feedback.message}
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
                  <Card.Text className="fw-semibold mb-3">${product.precio.toLocaleString('es-CL')}</Card.Text>
                  <Button variant="success" onClick={() => handleAddToCart(product)} className="mt-auto">
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