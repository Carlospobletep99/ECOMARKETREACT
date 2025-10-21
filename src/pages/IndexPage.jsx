import { Container } from 'react-bootstrap';

export default function IndexPage() {
  return (
    <section className="hero-section">
      <Container className="py-5">
        <div className="hero-overlay"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.72)' }}>
          <h1 className="display-5 mb-4">PRODUCTOS ECOLÓGICOS</h1>
          <p>
            En Ecomarket creemos que cada pequeña acción puede generar un gran cambio. Somos una tienda dedicada a ofrecer
            productos 100% ecológicos, saludables y responsables con el medio ambiente. Nuestro compromiso es acercarte
            alternativas sostenibles que cuiden de ti, de tu familia y del planeta.
          </p>
          <p>
            Trabajamos con productores locales y marcas que comparten nuestra visión de un consumo consciente, fomentando el
            comercio justo y reduciendo el impacto ambiental. En cada producto que encuentres en Ecomarket hay calidad,
            transparencia y un propósito: construir un estilo de vida más natural y respetuoso con la tierra.
          </p>
          <p>
            Porque para nosotros, no se trata solo de vender, sino de inspirar un cambio hacia un futuro más verde y sostenible.
            🌍💚
          </p>
        </div>
      </Container>
    </section>
  );
}