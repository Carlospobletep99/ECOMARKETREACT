import { Container, Row, Col } from 'react-bootstrap';

export default function SiteFooter() {
  return (
    <footer className="bg-light py-4 mt-auto">
      <Container>
        <Row className="text-center text-md-start gy-3">
          <Col md>
            <p className="mb-1 fw-semibold">ECOMARKET</p>
            <p className="mb-0">Productos ecológicos.</p>
          </Col>
          <Col md>
            <p className="mb-1 fw-semibold">Tiendas</p>
            <p className="mb-0">Quilpué - Viña del Mar</p>
          </Col>
          <Col md>
            <p className="mb-1 fw-semibold">Contacto</p>
            <p className="mb-0">contacto@ecomarket.cl</p>
          </Col>
        </Row>
        <div className="text-center mt-3">© 2025 Ecomarket - Sitio educativo</div>
      </Container>
    </footer>
  );
}