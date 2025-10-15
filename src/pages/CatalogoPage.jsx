import { useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { products } from '../data/products.js';
import { useEcomarket } from '../context/EcomarketContext.jsx';

export default function CatalogoPage() {
  const { addToCart } = useEcomarket();
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();
    if (!lowerQuery) {
      return products;
    }
    return products.filter(product => {
      return (
        product.nombre.toLowerCase().includes(lowerQuery) ||
        product.codigo.toLowerCase().includes(lowerQuery)
      );
    });
  }, [query]);

  const handleClear = () => setQuery('');

  return (
    <Container className="py-5">
      <section className="catalog-controls p-4 shadow-sm mb-4">
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
      </section>

      <section>
        <h2 className="mb-4">Catálogo</h2>
        <Row xs={1} sm={2} md={3} className="g-4">
          {filteredProducts.map(product => (
            <Col key={product.codigo}>
              <Card className="h-100 shadow-sm product-card">
                <Card.Img variant="top" src={product.imagen} alt={product.nombre} />
                <Card.Body>
                  <Card.Title>{product.nombre}</Card.Title>
                  <Card.Text className="small text-muted">{product.descripcion}</Card.Text>
                  <Card.Text className="fw-semibold mb-3">${product.precio.toLocaleString('es-CL')}</Card.Text>
                  <Button variant="success" onClick={() => addToCart(product)} className="mt-auto">
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