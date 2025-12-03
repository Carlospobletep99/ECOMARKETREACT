import PropTypes from 'prop-types';
import { Button, Modal } from 'react-bootstrap';

export default function AlertaConfirmacion({ 
  mostrar, 
  alCerrar, 
  alConfirmar, 
  titulo, 
  mensaje, 
  children,
  textoConfirmar = 'Confirmar', 
  textoCancelar = 'Cancelar', 
  variante = 'danger' 
}) {
  return (
    <Modal show={mostrar} onHide={alCerrar} centered>
      <Modal.Header closeButton>
        <Modal.Title>{titulo}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {mensaje && <p>{mensaje}</p>}
        {children}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={alCerrar}>
          {textoCancelar}
        </Button>
        <Button variant={variante} onClick={alConfirmar}>
          {textoConfirmar}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

AlertaConfirmacion.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  alCerrar: PropTypes.func.isRequired,
  alConfirmar: PropTypes.func.isRequired,
  titulo: PropTypes.string.isRequired,
  mensaje: PropTypes.string,
  children: PropTypes.node,
  textoConfirmar: PropTypes.string,
  textoCancelar: PropTypes.string,
  variante: PropTypes.string
};
