import { Button, Card, Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsCart3 } from 'react-icons/bs';
import { useEcomarket } from '../context/EcomarketContext.jsx';

export default function CarritoPage() {
  const { cart, cartTotal } = useEcomarket();

  return (
    <Container className="py-5">
      <section>
        <h2 className="mb-4 d-flex align-items-center gap-2">Carrito<BsCart3 /></h2>
        <Card className="shadow-sm">
          <Card.Body>
            {cart.length === 0 ? (
              <Row className="justify-content-center text-center">
                <Col lg={8}>
                  <p className="mb-4">Tu carrito está vacío. Explora el catálogo para agregar productos.</p>
                  <Button as={Link} to="/catalogo" variant="success">
                    Ir al catálogo
                  </Button>
                </Col>
              </Row>
            ) : (
              <>
                <Table responsive striped bordered hover className="align-middle mb-4">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Precio</th>
                      <th>Cantidad</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map(item => (
                      <tr key={item.codigo}>
                        <td>{item.nombre}</td>
                        <td>${item.precio.toLocaleString('es-CL')}</td>
                        <td>{item.cantidad}</td>
                        <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3} className="text-end fw-semibold">
                        Total
                      </td>
                      <td className="fw-semibold">${cartTotal.toLocaleString('es-CL')}</td>
                    </tr>
                  </tfoot>
                </Table>
                <div className="d-flex justify-content-end">
                  <Button as={Link} to="/pedido" variant="success">
                    Confirmar pedido
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </section>
    </Container>
  );
}