import { Card, Col, Container, Row } from 'react-bootstrap';
import { BsInstagram } from 'react-icons/bs';

export default function NosotrosPage() {
  return (
    <Container className="py-5">
      {/* INFO TIENDA */}
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm border-0">
            <Card.Body className="p-4">
              <h2 className="mb-3">Nuestras tiendas</h2>
              <p className="text-muted">Cobertura: V Región.</p>
              {/* MAPA Y DETALLE DE SUCURSALES */}
              <Row className="g-4 align-items-center">
                <Col md={6}>
                  <Card className="shadow-sm border-0 h-100">
                    <Card.Img variant="top" src="/images/mapa.jpg" alt="Mapa tienda Viña del Mar" />
                  </Card>
                </Col>
                <Col md={6}>
                  <h3 className="fw-semibold">Quilpué</h3>
                  <p className="mb-1">📍 Av. Los Carrera 1234, Quilpué</p>
                  <p className="mb-1">📞 (32) 1234 5678</p>
                  <p className="mb-1">📧 contacto@ecomarket.cl</p>
                  <p className="mb-1"><BsInstagram className="me-2 text-danger" />@ecomarket</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}