import { useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { products } from '../data/products.js';
import { BsCardChecklist } from 'react-icons/bs';
import { useEcomarket } from '../context/EcomarketContext.jsx';

export default function CatalogoPage() {
  const { addToCart } = useEcomarket();
  const [query, setQuery] = useState('');
 
 
  // Aqui se inicia las cantidades de productos en 1
  const [qtys, setQtys] = useState(() =>
    Object.fromEntries(products.map(p => [p.codigo, 1]))
  );

  // Poner cantidad para agregar al carrito



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


  // argumento :  esta función change QTY recibe dos argumentos: el código del producto (codigo) y el cambio en la cantidad (delta), que puede ser +1 o -1.
  const changeQty = (codigo, delta) => {
    setQtys(prev => {
      const current = prev[codigo] ?? 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [codigo]: next };
    });
  };

  const handleAddToCart = product => {
    const cantidad = qtys[product.codigo] ?? 1;
    // Si addToCart acepta (product, cantidad) lo llamamos, si no
    // intentamos pasar el producto con la propiedad cantidad.
    try {
      if (typeof addToCart === 'function') {
        if (addToCart.length >= 2) {
          addToCart(product, cantidad);
        } else {
          addToCart({ ...product, cantidad });
        }
      }
    } catch (e) {
      // fallback simple
      addToCart({ ...product, cantidad });
    }
  };
////----------------------------------------------

  return (
    <Container className="py-5">
      <section className="catalog-controls p-4 shadow-sm mb-4">
        <h2 className="mb-4 d-flex align-items-center gap-2">Catálogo<BsCardChecklist /></h2>    
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
        <Row xs={1} sm={2} md={3} className="g-4">
          {filteredProducts.map(product => (
            <Col key={product.codigo}>
              <Card className="h-100 shadow-sm product-card">
                <Card.Img variant="top" src={product.imagen} alt={product.nombre} />
                <Card.Body>
                  <Card.Title>{product.nombre}</Card.Title>
                  <Card.Text className="small text-muted">{product.descripcion}</Card.Text>
                  <Card.Text className="fw-semibold mb-3">${product.precio.toLocaleString('es-CL')}</Card.Text>

                  {/* Controles de cantidad */}
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => changeQty(product.codigo, -1)}
                    >
                      −
                    </Button>
                    <div style={{ minWidth: 40 }} className="text-center">
                      {qtys[product.codigo] ?? 1}
                    </div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => changeQty(product.codigo, +1)}
                    >
                      +
                    </Button>
                  </div>
                  {/* Controles de cantidad */}

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